import { AlertSummaryDto, AuxiliarValueDto } from './auxiliar-alert.dto';
import { ActivityDto } from './activity.dto';
import { CaseResolution, CaseStatus, DocumentAttachmentType } from '../case.enums';

export interface CaseDto {
  id: string;
  trackingNumber: string;
  caseStatus: CaseStatus;
  caseResolution: CaseResolution;

  creationDate: Date;
  lastUpdated: Date;

  creator: UserSummaryDto;
  expert?: UserSummaryDto | null;
  caseGroupId?: string | null;

  auxiliarValues?: AuxiliarValueDto[];
  alerts?: AlertSummaryDto[];

  notSolvedTime?: string | null; // TimeSpan in .NET → can be string (ISO 8601 duration) or number (ms)
  personalId: string;
  documentNumber: string;
  citizenName: string;
  dateOfBirth: Date;
  documentAttachmentType: DocumentAttachmentType;

  activities: ActivityDto[];
}

export interface CaseSummaryDto {
  id: string;
  trackingNumber: string;
  caseStatus: CaseStatus;
  caseResolution: CaseResolution;

  creationDate: Date;
  lastUpdated: Date;

  creator: UserSummaryDto;
  expert?: UserSummaryDto | null;
  caseGroupId?: string | null;

  auxiliarValues?: AuxiliarValueDto[];
  alerts?: AlertSummaryDto[];

  notSolvedTime?: string | null; // TimeSpan in .NET → can be string (ISO 8601 duration) or number (ms)
  personalId: string;
  documentNumber: string;
  citizenName: string;
  dateOfBirth: Date;
  documentAttachmentType: DocumentAttachmentType;
}

export interface UserSummaryDto {
  externalId: string;
  username: string;
  email: string;
}
