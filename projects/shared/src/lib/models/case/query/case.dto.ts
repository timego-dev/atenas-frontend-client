import { AlertSummaryDto, AuxiliarValueDto } from './auxiliar-alert.dto';
import { ActivityDto } from './activity.dto';
import { CaseResolution, CaseStatus, DocumentAttachmentType } from '../case.enums';

export interface CaseDto extends CaseSummaryDto {
  activities: ActivityDto[];
}

export interface LightCaseSumaryDto {
  id: string;
  trackingNumber: string;
  caseStatus: CaseStatus;
  caseResolution: CaseResolution;

  creationDate: Date;
  lastConsultation: Date;
  lastResolution?: Date | null;

  creator: UserSummaryDto;
  expert?: UserSummaryDto | null;

  caseGroupId?: string | null;

  auxiliarValues?: AuxiliarValueDto[];
  alerts?: AlertSummaryDto[];

  // --- Citizen and document data (added) ---
  citizenship?: string | null;
  issuingCountry?: string | null;
  issuingDate?: Date | null;
  citizenName?: string | null;
  citizenSurnames?: string | null;
  documentType?: string | null;
  expiryDate?: Date | null;
  gender?: string | null;
  placeOfBirth?: string | null;
  personalId?: string | null;
  documentNumber?: string | null;
  dateOfBirth?: Date | null;
  authority?: string | null;

  documentAttachmentType: DocumentAttachmentType;
}

export interface CaseSummaryDto extends LightCaseSumaryDto {
  caseGroup?: CaseGroupDto | null;
}

export interface CaseGroupDto {
  id: string;
  groupedBy: UserSummaryDto;
  groupedWhen: Date;
  cases: LightCaseSumaryDto[];
}

export interface UserSummaryDto {
  externalId: string;
  username: string;
  email: string;
}
