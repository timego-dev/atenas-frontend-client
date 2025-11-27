import { AthenasMessageDto } from '@shared/models/case/command/athenas-message.dto';
import { AttachmentDto } from '@shared/models/case/command/shared.dto';
import { ActivityType, AttachmentType } from '@shared/models/case/case.enums';
import { MRZWithPhoto, ScannerDVData } from '@shared/models/case/command/scanner-dv.dto';
import { ScannerCapturedData } from '../types/DocumentCaptureData';

export interface MappedMultipartAtenas {
  atenasInput: AthenasMessageDto;
  files: File[];
}

export class ScannerDvMapper {
  static mapToMultipartAtenas(
    input: ScannerCapturedData,
    attachFilePrefix: string,
    options?: {
      inputType?: ActivityType;
      text?: string;
      attachmentName?: string;
      digitalAttachments?: AttachmentDto[];
    }
  ): MappedMultipartAtenas {
    // Este array acumulará los archivos a medida que procesamos el objeto
    const filesAccumulator: File[] = [];

    const payload = this.transformToPayload(input, filesAccumulator, attachFilePrefix);

    const atenasInput: AthenasMessageDto = {
      type: options?.inputType ?? ActivityType.CONSULTATION,
      text: options?.text,
      attachmentList: [
        {
          name: options?.attachmentName ?? attachFilePrefix ?? 'ScanDoc',
          type: AttachmentType.DOCUMENT_DV,
          scannerDvData: payload,
        },
        ...(options?.digitalAttachments ?? []),
      ],
    };

    return { atenasInput, files: filesAccumulator };
  }

  private static transformToPayload(
    input: ScannerCapturedData,
    files: File[],
    prefix: string
  ): ScannerDVData {
    const doc = input.documentData;
    if (!doc) return { type: (input as any)?.type };

    const documentData: ScannerDVData['documentData'] = {
      identification: doc.identification ? { ...doc.identification } : undefined,
      mrz: doc.mrz ? { ...doc.mrz } : undefined,
      verificationData: doc.verificationData ? [...doc.verificationData] : undefined,
      chip: this.processMrzWithPhoto(doc.chip, 'CHIP', prefix, files),
      visual: this.processMrzWithPhoto(doc.visual, 'VISUAL', prefix, files),
      images: this.processDocImages(doc.images || (doc.visual as any)?.images, prefix, files),
    };

    const payload: ScannerDVData = {
      type: (input as any)?.type,
      documentData,
    };

    const rawVerifications = input.documentVerifications;

    const verificationsList = Array.isArray(rawVerifications)
      ? rawVerifications
      : rawVerifications?.verifications;

    console.log('verificationsList', verificationsList);

    if (verificationsList && verificationsList.length > 0) {
      payload.documentVerifications = {
        verifications: verificationsList.map((v: any) => {
          const { expected, result, ...rest } = v;

          return {
            ...rest,
            ...this.processVerificationImage(v, 'expected', expected, prefix, files),
            ...this.processVerificationImage(v, 'result', result, prefix, files),
          };
        }),
      };
    }

    console.log('payload.documentVerifications', payload.documentVerifications);

    return payload;
  }

  private static processMrzWithPhoto(
    source: any,
    label: string,
    prefix: string,
    files: File[]
  ): MRZWithPhoto | undefined {
    if (!source) return undefined;

    const { foto, ...mrzData } = source;

    const parsed = this.tryParseImage(foto);
    if (parsed) {
      const filename = this.createFileAndAdd(files, parsed, prefix, label);
      return { ...mrzData, fotoFile: { name: filename } };
    }

    return { ...mrzData };
  }

  /**
   * Convierte el objeto de imágenes {ir, uv, viz} al array de referencias [{type, file}]
   */
  private static processDocImages(
    imagesObj: any,
    prefix: string,
    files: File[]
  ): Array<{ type: string; file?: { name: string } }> | undefined {
    if (!imagesObj) return undefined;

    const result: Array<{ type: string; file?: { name: string } }> = [];
    const types = ['ir', 'uv', 'viz'];

    for (const t of types) {
      const base64 = imagesObj[t];
      const parsed = this.tryParseImage(base64);

      if (parsed) {
        const filename = this.createFileAndAdd(files, parsed, prefix, t.toUpperCase());
        result.push({ type: t, file: { name: filename } });
      }
    }
    return result.length ? result : undefined;
  }

  private static processVerificationImage(
    v: any,
    type: 'expected' | 'result',
    base64: string | undefined,
    prefix: string,
    files: File[]
  ): object {
    const parsed = this.tryParseImage(base64);
    if (!parsed) return {};

    const groupCode = String(v.group);

    const safeSource = this.sanitizeFilename(v.sourceMessage || 'unknown');
    const safePrefix = this.sanitizeFilename(prefix);
    const filename = `${safePrefix}_${groupCode}_${v.code}_${safeSource}_${type}.${parsed.extension}`;

    files.push(new File([parsed.blob], filename, { type: parsed.mime }));

    return type === 'expected'
      ? { expectedFile: { name: filename } }
      : { resultFile: { name: filename } };
  }

  private static createFileAndAdd(
    files: File[],
    parsed: { blob: Blob; mime: string; extension: string },
    prefix: string,
    suffix: string
  ): string {
    const safePrefix = this.sanitizeFilename(prefix);
    const filename = `${safePrefix}_${suffix}.${parsed.extension}`;
    files.push(new File([parsed.blob], filename, { type: parsed.mime }));
    return filename;
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

  private static sanitizeFilename(name: string): string {
    return (
      name
        .normalize('NFKD')
        .replace(/[^\w.-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 80) || 'file'
    );
  }
}
