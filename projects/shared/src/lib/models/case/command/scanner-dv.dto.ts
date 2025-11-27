import { DocumentDataDto, FormFileDto, ImageReferenceDto } from './shared.dto';

export interface ScannerDVData extends DocumentDataDto {
  documentData?: DocumentData;
  documentVerifications?: DocumentVerifications;
}

export interface DocumentData {
  identification?: Identification;
  chip?: MRZWithPhoto;
  visual?: MRZWithPhoto;
  mrz?: MRZ;
  images?: ImageReferenceDto[];
  verificationData?: DocumentVerificationData[];
}

export interface DocumentVerifications {
  verifications?: Verification[];
}

export interface Identification {
  nombre?: string;
  tipoDocumento?: string;
  codigoPais?: string;
  pais?: string;
  probability?: number;
}

export interface MRZ {
  idPersonal?: string;
  tipoDocumento?: string;
  paisExpedidor?: string;
  numeroDocumento?: string;
  fechaCaducidad?: string;
  nombre?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  fechaExpedicion?: string;
  nacionalidad?: string;
  sexo?: string;
  mrzCode?: string;
  lugarNacimiento?: string;
}

export interface MRZWithPhoto extends MRZ {
  fotoFile?: FormFileDto;
}

export interface DocumentVerificationData {
  nombre?: string;
  mrz?: string;
  rawVIZ?: string;
  viz?: string;
}

export interface Verification {
  group: VerificationGroup;
  code: VerificationCode;
  value?: number;
  sourceMessage?: string;
  expected?: string;
  expectedFile?: FormFileDto;
  result?: string;
  resultFile?: FormFileDto;
}

export enum VerificationGroup {
  MRZ,
  Chip,
  Integrity,
  Validity,
  OCR,
  Security,
  FingerprintQuality,
  FingerprintSegmentation,
}

export enum VerificationCode {
  /// <summary>
  /// Document Data
  /// </summary>
  PassportExpiry,
  TextMatch,
  DataIntegrity,
  /// <summary>
  /// MRZ
  /// </summary>
  CheckDigitComp,
  CheckDigit,
  ValidCountry,
  InvalidValue,
  /// <summary>
  /// Chip
  /// </summary>
  ChipActiveAuthentication,
  ChipPassiveAuthentication,
  ChipAccess,
  ChipAuthentication,
  ChipPresent,
  DG1DS,
  /// <summary>
  /// Document Image
  /// </summary>
  ImageMatch,
  UV,
  /// <summary>
  /// FingerprintQuality
  /// </summary>
  FingerprintQualityCheck,
  FingerprintFakeDetection, // Huellas falsas
  /// <summary>
  /// FingerprintSegmentation
  /// </summary>
  FingerprintHandMixCheck, // Mano cambiada
  FingerprintAmbiguousSlap, // Cruza de dedos entre dos manos
  FingerprintCompletation, // Pocas huellas
}
