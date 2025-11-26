import { DigitalAttachmentType } from '../case.enums';

export interface DigitalAttachmentDto {
  fileType: string;
  digitalAttachmentType: DigitalAttachmentType;
  dataId: string;
}

export interface DocumentPageDataDto {
  part?: string;
  mrzEntries: string[];
  imageMapId?: string;
  images?: ImageMapDto;
  imageMetaData: Record<string, string>;
}

export interface ImageMapDto {
  entries: ImageMapEntryDto[];
}

export interface ImageMapEntryDto {
  type: string;
  mediaBinaryId: string;
}
