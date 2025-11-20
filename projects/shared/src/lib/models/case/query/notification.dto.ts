import { NotificationType } from "@shared/models/shared.enums";

export interface NotificationDto {
  id: string;
  type: NotificationType;
  read: boolean;
}
