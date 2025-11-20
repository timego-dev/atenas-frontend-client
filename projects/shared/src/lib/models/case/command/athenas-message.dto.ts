import { ActivityType, CaseResolution } from "@shared/models/shared.enums";
import { AttachmentDto } from "./shared.dto";
import { CloudIDVResponseDto, FacialResponseDto } from "./cloud-idv.dto";

export interface AthenasMessageDto {
  type: ActivityType;
  resolution?: CaseResolution | null;
  text?: string | null;
  attachmentList?: AttachmentDto[] | null;
  data?: AthenasMessageDataDto | null;
  creationDate: number;
}

/**
 * Helper DTO to model the union type in AthenasMessageDto.data.
 */
export interface AthenasMessageDataDto {
  /** Contains value if 'data' is of type CloudIDVResponse. */
  cloudIDVResponse?: CloudIDVResponseDto | null;

  /** Contains value if 'data' is of type Record<string, FacialResponse>. */
  facialResponses?: Record<string, FacialResponseDto> | null;
}
