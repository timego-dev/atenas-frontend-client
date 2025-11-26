import { CloudIDVRequestDto } from './cloud-idv.dto';
import { ScannerDVData } from './scanner-dv.dto';
import { AttachmentType, DigitalAttachmentType, DocumentAttachmentType } from '../case.enums';

export interface AttachmentDto {
  name: string;
  type: AttachmentType;
  cloudIdvRequest?: CloudIDVRequestDto;
  scannerDvData?: ScannerDVData;
  digitalData?: DigitalDataDTO;
}

export interface DigitalDataDTO {
  type: DigitalAttachmentType;
  fileType?: string;
  digitalFile?: FormFileDto;
}

// ⬇ Shared types

export interface ImageReferenceDto {
  type: string; // e.g. "Ir", "Uv", "Viz"
  file?: FormFileDto;
}

export interface DocumentDataDto {
  type: DocumentAttachmentType;
}

export interface FormFileDto {
  file?: File;      // Angular replaces IFormFile with browser File
  name: string;
}

