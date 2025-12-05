import { DocumentIdvAttachmentDto } from './document-idv.dto';
import { DocumentDvAttachmentDto } from './document-dv.dto';
import { DigitalAttachmentDto } from './document-shared.dto';
import { AttachmentType, DocumentAttachmentType } from '../case.enums';
import { UserSummaryDto } from './case.dto';

export interface ConsultationActivityDto {
  attachments: AttachmentResponseDto[];
}

export interface AttachmentResponseDto {
  attachmentType: AttachmentType;
  name?: string;
  metadata?: string | null;
  documentIdvAttachment?: DocumentIdvAttachmentDto | null;
  documentDvAttachment?: DocumentDvAttachmentDto | null;
  digitalAttachment?: DigitalAttachmentDto | null;
}

// Abstract-like base
export interface DocumentAttachmentDto {
  documentType: DocumentAttachmentType;
}
