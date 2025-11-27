import {
  DocumentVerificationData,
  DocumentVerifications,
  Identification,
  MRZ,
  MRZWithPhoto,
} from '@shared/models/case/command/scanner-dv.dto';

export class ScannerCapturedData {
  public documentData?: DocumentCapturedData;
  public documentVerifications?: DocumentVerifications;
}

// The structure is similar to the one that will be sent to the backend,
// mainly changing the images.
export class DocumentCapturedData {
  public identification?: Identification;
  public chip?: MRZWithPhoto;
  public visual?: MRZWithPhoto;
  public mrz?: MRZ;
  public images?: Images;
  public verificationData?: DocumentVerificationData[];
}

export class Images {
  public ir?: string;
  public uv?: string;
  public viz?: string;
  public backIR?: string;
  public backUV?: string;
  public backVIZ?: string;
}
