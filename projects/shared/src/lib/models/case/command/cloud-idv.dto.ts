import { DocumentDataDto, FormFileDto, ImageReferenceDto } from "./shared.dto";


export interface CloudIDVRequestDto extends DocumentDataDto {
  requesterId?: string;
  pdf?: string;
  tiff?: string;
  pages: PageDto[];
  doCropping?: boolean;
  doBlackening?: boolean;
  transactionId?: string;
  chipData?: ChipDto | null;
  readChipError?: boolean;
}

export interface PageDto {
  part: string;
  images: PageImagesDto;
  mrz: string[];
  imageMetaData?: Record<string, string>;
}

export interface PageImagesDto {
  references: ImageReferenceDto[];
}

export interface ChipDto {
  com: FormFileDto;
  sod: FormFileDto;
  dg: Record<string, FormFileDto>;
  status?: Record<string, string>;
  signature?: string;
  version?: number;
}

export interface CloudIDVResponseDto {
  result: CloudIDVResultDto;
}

export interface CloudIDVResultDto {
  actions: DocumentVerificationResultActionDto[];
  birthDate: string;
  chipResult?: ChipResultDto;
  country: string;
  cropResult: boolean;
  documentNumber: string;
  documentType: string;
  dvTime: number;
  expiryDate: string;
  externalData: unknown;
  firstName: string;
  gender: string;
  identificationTime: number;
  minimumResolutionFailed: boolean;
  missingPage: boolean;
  mrzTextFields: unknown;
  pages: PageDto[];
  portrait: string;
  responseTime: string;
  subKey: string;
  surname: string;
  templateKey: string;
  templateName: string;
  templateRepositoryVersion: string;
  transactionId: string;
  verificationTime: number;
}

export interface DocumentVerificationResultActionDto {
  outputs: ResultActionOutputDto[];
  resultValue: number;
  score: number;
  threshold: number;
  verificationCategory: string;
  verificationName: string;
  verificationType: string;
}

export interface ResultActionOutputDto {
  name: string;
  text: string;
  base64Image?: string;
}

export interface ChipResultDto {
  actions: DocumentVerificationResultActionDto[];
  chipOutput: 'OK' | 'KO';
}

export interface FacialResponseDto {
  errorMessage: string;
  idFaceTransaction: string;
  isAnalyzed: boolean;
  result: 'OK' | 'KO';
  score: number;
  subKey: string;
  times: FacialResponseTimesDto;
  type: string;
}

export interface FacialResponseTimesDto {
  creationDate: string;
  finishDate: string;
  processingTime: number;
}
