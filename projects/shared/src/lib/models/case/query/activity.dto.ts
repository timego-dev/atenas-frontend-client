import { ActivityType, CaseResolution } from '../case.enums';
import { ConsultationActivityDto } from './attachment.dto';
import { UserSummaryDto } from './case.dto';
import { DocumentVerificationAutomaticActivityDto } from './document-verification-automatic-activity.dto';

export interface ActivityDto {
  type: ActivityType;
  creationDate: Date;
  text: string;
  creator?: UserSummaryDto | null;

  consultation?: ConsultationActivityDto | null;
  resolution?: ResolutionActivityDto | null;
  faceVerification?: FaceVerificationAutomaticActivityDto | null;
  documentVerification?: DocumentVerificationAutomaticActivityDto | null;
}

export interface FaceVerificationAutomaticActivityDto {
  faceVerificationResults: FaceVerificationResultDto[];
}

export interface FaceVerificationResultDto {
  key: string;
  idFaceTransaction?: string;
  type?: string;
  isAnalyzed: boolean;
  result?: string;
  subKey?: string;
  errorMessage?: string;
  score: number;
  correlationId?: string;
  times: Record<string, unknown>;
}

export interface ResolutionActivityDto {
  resolution: CaseResolution;
}
