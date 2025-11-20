import { DocumentPageDataDto } from "./document-shared.dto";
import { DocumentMrzDataDto, DocumentOcrDataDto } from "./document-textdata.dto";
import { DocumentChipResultDto, DocumentVerificationActionDto } from "./document-verification.dto";

export interface DocumentVerificationAutomaticActivityDto {
  pdfId?: string;
  subject?: string;
  body?: string;
  errorMessage?: string;

  transactionId?: string;
  verificationTime: number;
  responseTime?: string; // ISO string

  pages: DocumentPageDataDto[];

  documentChipResultId?: string;
  chipResult?: DocumentChipResultDto;

  workstation?: string;

  startTime: string; // ISO string
  endTime: string;   // ISO string

  exception?: string;

  externalData: { [key: string]: string };

  templateRepositoryVersion?: string;
  minimumResolutionFailed: boolean;
  subKey?: string;
  country?: string;
  documentType?: string;
  templateName?: string;
  templateKey?: string;

  actions: DocumentVerificationActionDto[];

  missingPage: boolean;
  cropResult: boolean;

  surname?: string;
  firstName?: string;
  birthDate?: string;
  expiryDate?: string;
  gender?: string;
  documentNumber?: string;
  issuingDate?: string;

  portraitId?: string;

  mrzExtractionTime: number;
  croppingTime: number;
  dvTime: number;

  documentMrzDataId?: string;
  mrzTextFields?: DocumentMrzDataDto;

  documentOcrDataId?: string;
  ocrTextFields?: DocumentOcrDataDto;

  captureTime?: number;
  identificationTime?: number;
}
