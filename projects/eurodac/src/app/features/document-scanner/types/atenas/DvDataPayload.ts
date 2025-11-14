import { DocumentVerificationData, MRZ } from '../at10k/ScannerDVData';
import { VerificationCode } from '../at10k/VerificationCode';
import { VerificationGroup } from '../at10k/VerificationGroup';

export type DvImageEntry = { type: string; file?: { name: string } };

export type DvVerificationEntry = {
  group: VerificationGroup;
  code: VerificationCode;
  value: number | null;
  sourceMessage?: string;
  expected: null;
  result: null;
  expectedFile?: { name: string };
  resultFile?: { name: string };
};

export interface DvDataPayload {
  // Ej.: "TD1", "TD2", etc.
  type?: string;

  documentData?: {
    identification?: {
      nombre?: string;
      tipoDocumento?: string;
      codigoPais?: string;
      pais?: string;
      probability?: number;
    };
    chip?: MRZ | (MRZ & { fotoFile?: { name: string } });
    visual?: MRZ | (MRZ & { fotoFile?: { name: string } });
    mrz?: MRZ;
    images?: DvImageEntry[];
    verificationData?: DocumentVerificationData[];
  };

  documentVerifications?: {
    verifications?: DvVerificationEntry[];
  };
}
