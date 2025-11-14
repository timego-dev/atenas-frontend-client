import { DvDataPayload } from './DvDataPayload';

export type AtenasAttachmentType = 'DOCUMENT_DV' | 'DIGITAL';

export interface AtenasAttachmentDocumentDV {
  name: string;
  type: 'DOCUMENT_DV';
  scannerDvData: DvDataPayload;
}

export interface AtenasAttachmentDigital {
  name: string;
  type: 'DIGITAL';
  digitalData: {
    type: 'VIDEO' | 'AUDIO' | 'IMAGE' | string;
    digitalFile?: { name: string };
  };
}

export type AtenasAttachment =
  | AtenasAttachmentDocumentDV
  | AtenasAttachmentDigital;

export interface AtenasInput {
  type: string;
  text?: string;
  attachmentList: AtenasAttachment[];
  creationDate?: number;
}
