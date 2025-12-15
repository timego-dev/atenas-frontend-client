export interface SystemConfigurationDto {
  // Purge
  purgeDaysWithoutCounterfeitCases: number;
  purgeDailyExecutionTime: string; // TimeOnly is usually sent as "HH:mm"

  // Counterfeit cases
  counterfeitNotificationEmails: string;

  // Case search
  maxCaseSearchOccurrences: number;

  // Service
  maxPendingTimeMinutes: number;
}
