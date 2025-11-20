import { DocumentAttachmentDto } from "./attachment.dto";

export interface DocumentDvAttachmentDto extends DocumentAttachmentDto {
  scannerDvData: ScannerDvDataDto;
  mrzVizVerifications: DocumentVerificationDataDto[];
  documentVerifications: VerificationDto[];
}

export interface ScannerDvDataDto {
  nombre?: string;
  tipoDocumento?: string;
  codigoPais?: string;
  pais?: string;
  probability?: number;
  chip?: MRZDto;
  visual?: MRZDto;
  mrz?: MRZDto;
  imageMaps: ImageMapEntryDto[];
}

export interface MRZDto {
  fotoId?: string | null;
  idPersonal?: string;
  tipoDocumento?: string;
  paisExpedidor?: string;
  numeroDocumento?: string;
  fechaCaducidad?: string | null;
  fechaExpedicion?: string | null;
  nombre?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  sexo?: string;
  mrzCode?: string;
  lugarNacimiento?: string | null;
}

export interface DocumentVerificationDataDto {
  nombre?: string;
  mrz?: string;
  rawVIZ?: string;
  viz?: string;
}

export interface VerificationDto {
  group: string;     // VerificationGroup (enum)
  code: string;      // VerificationCode (enum)
  value: number;
  sourceMessage?: string;
  expected?: string | null;
  result?: string | null;
}

export interface ImageMapEntryDto {
  type: string;
  mediaBinaryId: string;
}
