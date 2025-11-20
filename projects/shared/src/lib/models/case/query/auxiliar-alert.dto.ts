export interface AuxiliarValueDto {
  id: string;
  title: string;
  value?: string | null;
  required: boolean;
}

export interface AlertSummaryDto {
  id: string;
  name: string;
  active: boolean;
}
