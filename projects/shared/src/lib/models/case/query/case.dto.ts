import { CaseResolution, CaseStatus } from "@shared/models/shared.enums";
import { AlertSummaryDto, AuxiliarValueDto } from "./auxiliar-alert.dto";
import { ActivityDto } from "./activity.dto";
import { NotificationDto } from "./notification.dto";

export interface CaseDto {
  id: string;
  trackingNumber: string;
  caseStatus: CaseStatus;
  caseResolution: CaseResolution;

  creationDate: Date;
  lastUpdated: Date;

  creatorId: string;
  expertId?: string | null;
  caseGroupId?: string | null;

  auxiliarValues?: AuxiliarValueDto[];
  alerts?: AlertSummaryDto[];

  activities: ActivityDto[];
  notifications: NotificationDto[];
}

export interface CaseSummaryDto {
  id: string;
  trackingNumber: string;
  caseStatus: CaseStatus;
  caseResolution: CaseResolution;

  creationDate: Date;
  lastUpdated: Date;

  creatorId: string;
  expertId?: string | null;
  caseGroupId?: string | null;

  auxiliarValues?: AuxiliarValueDto[];
  alerts?: AlertSummaryDto[];
}
