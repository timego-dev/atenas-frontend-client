import { Verification } from './Verification';

export class ScannerDVData {
  constructor(
    public documentData?: DocumentData,
    public documentVerifications?: DocumentVerifications
  ) {}
}

export class DocumentData {
  public identification?: Identification;
  public chip?: MRZWithPhoto;
  public visual?: MRZWithPhoto;
  public mrz?: MRZ;
  public images?: Images;
  public verificationData?: DocumentVerificationData[];
}

export class DocumentVerificationData {
  public nombre?: string;
  public mrz?: string;
  public rawVIZ?: string;
  public viz?: string;
}

export class DocumentVerifications {
  constructor(public verifications?: Verification[]) {}
}

export class Identification {
  public nombre?: string;
  public tipoDocumento?: string;
  public codigoPais?: string;
  public pais?: string;
  public probability?: number;
}

export class CaptureOptions {
  public lecturaChip?: boolean;
  public verificaChip?: boolean;
  public verificaImagenes?: boolean;
  public identificationTimeout?: number;
}

export class MRZ {
  public idPersonal?: string;
  public tipoDocumento?: string;
  public paisExpedidor?: string;
  public numeroDocumento?: string;
  public fechaCaducidad?: string;
  public fechaExpedicion?: string;
  public nombre?: string;
  public apellidos?: string;
  public fechaNacimiento?: string;
  public nacionalidad?: string;
  public sexo?: string;
  public mrzCode?: string;
  public lugarNacimiento?: string;
}

export class MRZWithPhoto extends MRZ {
  public foto?: string;
}

export class Images {
  public ir?: string;
  public uv?: string;
  public viz?: string;
  public backIR?: string;
  public backUV?: string;
  public backVIZ?: string;
}

export enum DocumentReaderErrorCodes {
  UNKNOWN,
  UNINITIALIZE,
  NOTCAPTURING,
  DISCONNECT,
  YETINITIALIZE,
  TIMEOUT,
  VALIDATION,
  IDENTIFICATION,
}
