import { AttachmentDto } from './shared.dto';
import { CloudIDVResponseDto, FacialResponseDto } from './cloud-idv.dto';
import { ActivityType, CaseResolution } from '../case.enums';

export interface AthenasMessageDto {
  type: ActivityType;
  resolution?: CaseResolution | null;
  text?: string | null;
  attachmentList?: AttachmentDto[] | null;
  data?: AthenasMessageDataDto | null;
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
