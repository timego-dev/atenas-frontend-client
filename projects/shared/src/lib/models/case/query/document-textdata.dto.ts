export interface DocumentMrzDataDto {
  mrzRawData?: string;
  documentType?: string;
  issuingState?: string;
  lastName?: string;
  firstName?: string;
  documentNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  sex?: string;
  dateOfExpiry?: string;
  optionalData?: string;
}

export interface DocumentOcrDataDto {
  dateOfIssue?: string;
  documentNumber?: string;
  dateOfExpiry?: string;
  lastName?: string;
  firstName?: string;
  dateOfBirth?: string;
  nationality?: string;
  sex_Gender?: string;
  placeOfBirth?: string;
  address?: string;
  optionalData?: string;
  none?: string;
  fullName?: string;
  documentType?: string;
  personalNumber?: string;
  profession?: string;
  occupation?: string;
  issuingState?: string;
  personalSummary?: string;
  otherDataidTdNumbers?: string;
  custodyInformation?: string;
  date_Of_Registration?: string;
  age?: string;
  folio_Number?: string;
  voter_Key?: string;
  address_Municipality?: string;
  address_Location?: string;
  section?: string;
  ocrField?: string;
  address_Jurisdiction_Code?: string;
}
