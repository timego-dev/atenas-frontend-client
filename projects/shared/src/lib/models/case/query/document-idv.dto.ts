import { DocumentAttachmentDto } from "./attachment.dto";
import { DocumentPageDataDto } from "./document-shared.dto";

export interface DocumentIdvAttachmentDto extends DocumentAttachmentDto {
  requesterId?: string;
  pdf?: string;
  tiff?: string;
  doCropping?: boolean;
  doBlackening?: boolean;
  documentTypeSize?: string;
  documentDimensions?: string;
  transactionId?: string;
  channel?: string;
  correlationId?: string;
  returnImages?: boolean;
  ocrOverwrittenValues?: Record<string, string>;
  returnPDFReport?: boolean;
  externalData?: Record<string, string>;
  chipData?: DocumentChipDataDto | null;
  readChipError?: boolean;
  pages: DocumentPageDataDto[];
}

export interface DocumentChipDataDto {
  com: string;
  sod?: string | null;
  dg: Record<string, string>;
  status: Record<string, string>;
  signature?: string;
  version: number;
}
