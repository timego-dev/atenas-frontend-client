import { AtenasAttachmentDigital, AtenasInput } from '../../types/atenas/AtenasInput';
import { DvDataPayload } from '../../types/atenas/DvDataPayload';
import {
  ScannerDVData,
  DocumentData,
  Images,
  MRZWithPhoto,
  MRZ,
} from '../../types/at10k/ScannerDVData';
import { VerificationCode } from '../../types/at10k/VerificationCode';
import { VerificationGroup } from '../../types/at10k/VerificationGroup';

export interface FileAttachment {
  field: string;
  filename: string;
  blob: Blob;
}

export interface MappedMultipartAtenas {
  atenasInput: AtenasInput;
  files: FileAttachment[];
}

type ImageRefs = {
  chipPhotoName?: string;
  visualPhotoName?: string;
  images?: { ir?: string; uv?: string; viz?: string };
};

type VerificationFileRefs = Array<{
  expectedFileName?: string;
  resultFileName?: string;
}>;

export class ScannerDvMapper {
  private static readonly allowedImageTypes = ['ir', 'uv', 'viz'] as const;

  static mapToMultipartAtenas(
    input: ScannerDVData,
    attachFilePrefix: string,
    options?: {
      includeVerifications?: boolean;
      groupCodeMode?: 'numeric' | 'name';
      inputType?: string; // CONSULTATION
      text?: string; // Please verify the attached documents.
      creationDate?: number | Date;
      attachmentName?: string;
      digitalAttachments?: AtenasAttachmentDigital[];
    }
  ): MappedMultipartAtenas {
    // Imágenes del documento (CHIP/VISUAL/IR/UV/VIZ) + referencias internas
    const { files: docImages, refs: imageRefs } = this.extractDocumentImagesWithRefs(
      input,
      attachFilePrefix
    );

    // Imágenes de verificaciones (expected/result) + referencias internas
    const { files: verificationImages, refs: verificationRefs } =
      this.extractVerificationImagesWithRefs(
        input,
        attachFilePrefix,
        options?.groupCodeMode ?? 'numeric'
      );

    const files = [...docImages, ...verificationImages];

    // Payload con referencias de archivo
    const payload = this.toEndpointPayload(input, {
      includeVerifications: options?.includeVerifications,
      imageRefs,
      verificationRefs,
      attachFilePrefix,
    });

    const atenasInput: AtenasInput = {
      type: options?.inputType ?? 'CONSULTATION',
      text: options?.text,
      creationDate: this.normalizeCreationDate(options?.creationDate),
      attachmentList: [
        {
          name: options?.attachmentName ?? attachFilePrefix ?? 'ScanDoc',
          type: 'DOCUMENT_DV',
          scannerDvData: payload,
        },
        ...(options?.digitalAttachments ?? []),
      ],
    };

    return { atenasInput, files };
  }

  private static normalizeCreationDate(d?: number | Date): number | undefined {
    if (!d && d !== 0) return undefined;
    return typeof d === 'number' ? d : d.getTime();
  }

  static toEndpointPayload(
    input: ScannerDVData,
    options?: {
      includeVerifications?: boolean;
      imageRefs?: ImageRefs;
      verificationRefs?: VerificationFileRefs;
      attachFilePrefix?: string;
    }
  ): DvDataPayload {
    const doc: DocumentData | undefined = input?.documentData;

    const documentData: NonNullable<DvDataPayload['documentData']> = {
      identification: doc?.identification && {
        nombre: doc.identification.nombre,
        tipoDocumento: doc.identification.tipoDocumento,
        codigoPais: doc.identification.codigoPais,
        pais: doc.identification.pais,
        probability: doc.identification.probability,
      },
      chip: this.cloneMrzWithPhotoFile(doc?.chip, options?.imageRefs?.chipPhotoName) as any,
      visual: this.cloneMrzWithPhotoFile(doc?.visual, options?.imageRefs?.visualPhotoName) as any,
      mrz: this.cloneMrz(doc?.mrz),
      images: this.mapImagesWithFiles(
        (doc?.images ?? (doc?.visual as any)?.images) as any,
        options?.imageRefs?.images
      ),
      verificationData: doc?.verificationData ? [...doc.verificationData] : undefined,
    };

    const payload: DvDataPayload = {
      type: (input as any)?.type, // p.ej. "TD1"
      documentData,
    };

    if (options?.includeVerifications && input?.documentVerifications?.verifications?.length) {
      const verifs = input.documentVerifications.verifications;
      payload.documentVerifications = {
        verifications: verifs.map((v, idx) => {
          const fileRefs = options?.verificationRefs?.[idx];
          return {
            group: v.group,
            code: v.code,
            value: v.value as any,
            sourceMessage: v.sourceMessage,
            expected: null,
            result: null,
            ...(fileRefs?.expectedFileName
              ? { expectedFile: { name: fileRefs.expectedFileName } }
              : {}),
            ...(fileRefs?.resultFileName ? { resultFile: { name: fileRefs.resultFileName } } : {}),
          };
        }),
      };
    }

    return payload;
  }

  private static cloneMrz<T extends MRZ | MRZWithPhoto | undefined>(mrz: T): MRZ | undefined {
    if (!mrz) return undefined;
    const {
      idPersonal,
      tipoDocumento,
      paisExpedidor,
      numeroDocumento,
      fechaCaducidad,
      fechaExpedicion,
      nombre,
      apellidos,
      fechaNacimiento,
      nacionalidad,
      sexo,
      mrzCode,
      lugarNacimiento,
    } = mrz;
    return {
      idPersonal,
      tipoDocumento,
      paisExpedidor,
      numeroDocumento,
      fechaCaducidad,
      fechaExpedicion,
      nombre,
      apellidos,
      fechaNacimiento,
      nacionalidad,
      sexo,
      mrzCode,
      lugarNacimiento,
    };
  }

  private static cloneMrzWithPhotoFile(
    mrz: MRZ | MRZWithPhoto | undefined,
    fotoBaseName?: string
  ): MRZ | (MRZ & { fotoFile: { name: string } }) | undefined {
    const base = this.cloneMrz(mrz);
    if (!base) return undefined;
    if (fotoBaseName) {
      return {
        ...base,
        fotoFile: { name: fotoBaseName },
      } as any;
    }
    return base;
  }

  private static mapImagesWithFiles(
    images?: Images,
    refs?: { ir?: string; uv?: string; viz?: string }
  ): Array<{ type: string; file?: { name: string } }> | undefined {
    if (!images && !refs) return undefined;
    const out: Array<{ type: string; file?: { name: string } }> = [];
    for (const t of this.allowedImageTypes) {
      const hasVal = (images as any)?.[t];
      const name = refs?.[t];
      if (hasVal || name) {
        out.push({
          type: t,
          ...(name ? { file: { name } } : {}),
        });
      }
    }
    return out.length ? out : undefined;
  }

  private static extractDocumentImagesWithRefs(
    input: ScannerDVData,
    attachFilePrefix: string
  ): { files: FileAttachment[]; refs: ImageRefs } {
    const files: FileAttachment[] = [];
    const refs: ImageRefs = {};
    const doc: DocumentData | undefined = input?.documentData;

    // CHIP.foto
    const chipPhoto = (doc?.chip as any)?.foto as string | undefined;
    const chipParsed = this.tryParseImage(chipPhoto);
    if (chipParsed && chipParsed.blob.size > 0) {
      const base = this.buildDocImageBasename(attachFilePrefix, 'CHIP'); // SIN extensión
      const filename = `${base}.${chipParsed.extension}`; // CON extensión
      files.push({ field: base, filename, blob: chipParsed.blob });
      refs.chipPhotoName = base; // referencia sin extensión
    }

    // VISUAL.foto
    const visualPhoto = (doc?.visual as any)?.foto as string | undefined;
    const visualParsed = this.tryParseImage(visualPhoto);
    if (visualParsed && visualParsed.blob.size > 0) {
      const base = this.buildDocImageBasename(attachFilePrefix, 'VISUAL');
      const filename = `${base}.${visualParsed.extension}`;
      files.push({ field: base, filename, blob: visualParsed.blob });
      refs.visualPhotoName = base;
    }

    // IR/UV/VIZ: pueden venir en doc.visual.images o en doc.images
    const visualImages = (doc?.visual as any)?.images as Images | undefined;
    const rootImages = doc?.images as Images | undefined;
    const images = visualImages ?? rootImages;

    const imagesRefs: NonNullable<ImageRefs['images']> = {};
    if (images) {
      const tryAdd = (key: 'ir' | 'uv' | 'viz', label: 'IR' | 'UV' | 'VIZ') => {
        const val = (images as any)[key] as string | undefined;
        const parsed = this.tryParseImage(val);
        if (parsed && parsed.blob.size > 0) {
          const base = this.buildDocImageBasename(attachFilePrefix, label);
          const filename = `${base}.${parsed.extension}`;
          files.push({ field: base, filename, blob: parsed.blob });
          imagesRefs[key] = base; // referencia sin extensión
        }
      };
      tryAdd('ir', 'IR');
      tryAdd('uv', 'UV');
      tryAdd('viz', 'VIZ');
    }
    if (Object.keys(imagesRefs).length > 0) {
      refs.images = imagesRefs;
    }

    return { files, refs };
  }

  static extractVerificationImagesWithRefs(
    input: ScannerDVData,
    attachFilePrefix: string,
    groupCodeMode: 'numeric' | 'name' = 'numeric'
  ): { files: FileAttachment[]; refs: VerificationFileRefs } {
    const files: FileAttachment[] = [];
    const refs: VerificationFileRefs = [];
    const verifs = input?.documentVerifications?.verifications ?? [];

    for (const v of verifs) {
      const ref: { expectedFileName?: string; resultFileName?: string } = {};

      const expBlob = this.tryParseImage(v.expected);
      if (expBlob && expBlob.blob.size > 0) {
        const filename = this.buildVerificationFilename(
          attachFilePrefix,
          v.group,
          v.code,
          v.sourceMessage,
          'expected',
          expBlob.extension,
          groupCodeMode
        );
        const base = this.filenameWithoutExtension(filename); // SIN extensión
        files.push({ field: base, filename, blob: expBlob.blob });
        ref.expectedFileName = base;
      }

      const resBlob = this.tryParseImage(v.result);
      if (resBlob && resBlob.blob.size > 0) {
        const filename = this.buildVerificationFilename(
          attachFilePrefix,
          v.group,
          v.code,
          v.sourceMessage,
          'result',
          resBlob.extension,
          groupCodeMode
        );
        const base = this.filenameWithoutExtension(filename); // SIN extensión
        files.push({ field: base, filename, blob: resBlob.blob });
        ref.resultFileName = base;
      }

      refs.push(ref);
    }
    return { files, refs };
  }

  private static tryParseImage(
    value?: string | null
  ): { blob: Blob; mime: string; extension: string } | null {
    if (!value) return null;
    const s = value.trim();
    if (this.isDataUrl(s)) return this.dataUrlToBlob(s);
    if (this.looksLikeBase64(s)) {
      const mime = this.guessMimeFromBase64Prefix(s) ?? 'image/jpeg';
      return this.base64ToBlob(s, mime);
    }
    return null;
  }

  private static isDataUrl(v: string): boolean {
    return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(v);
  }

  private static looksLikeBase64(v: string): boolean {
    const clean = v.replace(/\s/g, '');
    if (clean.length % 4 !== 0) return false;
    return /^[A-Za-z0-9+/]+={0,2}$/.test(clean);
  }

  private static guessMimeFromBase64Prefix(b64: string): string | null {
    const s = b64.slice(0, 16);
    if (s.startsWith('/9j/')) return 'image/jpeg';
    if (s.startsWith('iVBORw0KGgo')) return 'image/png';
    if (s.startsWith('UklGR')) return 'image/webp';
    if (s.startsWith('Qk')) return 'image/bmp';
    if (s.startsWith('SUkq') || s.startsWith('TU0q')) return 'image/tiff';
    return null;
  }

  private static dataUrlToBlob(dataUrl: string) {
    const [header, b64] = dataUrl.split(',');
    const mimeMatch = header.match(/data:([^;]+);base64/i);
    const mime = mimeMatch?.[1] || 'application/octet-stream';
    return this.base64ToBlob(b64, mime);
  }

  private static base64ToBlob(b64: string, mime: string) {
    const clean = b64.replace(/\s/g, '');
    let binary: string;
    try {
      binary = atob(clean);
    } catch {
      return {
        blob: new Blob([], { type: mime }),
        mime,
        extension: this.mimeToExtension(mime),
      };
    }
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime });
    const extension = this.mimeToExtension(mime);
    return { blob, mime, extension };
  }

  private static mimeToExtension(mime: string): string {
    switch (mime.toLowerCase()) {
      case 'image/jpeg':
      case 'image/jpg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/bmp':
        return 'bmp';
      case 'image/tiff':
        return 'tiff';
      default:
        return 'bin';
    }
  }

  private static buildVerificationFilename(
    attachFilePrefix: string,
    group: VerificationGroup,
    code: VerificationCode,
    sourceMessage: string | undefined,
    suffix: 'expected' | 'result',
    extension: string,
    groupCodeMode: 'numeric' | 'name'
  ): string {
    const groupCode =
      groupCodeMode === 'name' ? this.getVerificationGroupName(group) : String(group);
    const safeSource = this.sanitizeFilename(sourceMessage || 'unknown');
    const safePrefix = this.sanitizeFilename(attachFilePrefix || 'attach');
    // nombre con extensión para el adjunto físico
    return `${safePrefix}_${groupCode}_${code}_${safeSource}_${suffix}.${extension}`;
  }

  private static getVerificationGroupName(group: VerificationGroup): string {
    const name = (VerificationGroup as any)[group];
    return name ?? `Group${group}`;
  }

  private static sanitizeFilename(name: string): string {
    return (
      name
        .normalize('NFKD')
        .replace(/[^\w.-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 80) || 'file'
    );
  }

  private static buildDocImageBasename(
    attachFilePrefix: string,
    label: 'CHIP' | 'VISUAL' | 'IR' | 'UV' | 'VIZ'
  ): string {
    const safePrefix = this.sanitizeFilename(attachFilePrefix || 'attach');
    // sin extensión (para referencias internas)
    return `${safePrefix}_${label}`;
  }

  private static filenameWithoutExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? filename : filename.slice(0, lastDot);
  }
}
