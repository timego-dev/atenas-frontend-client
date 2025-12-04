import { FieldType } from '@shared/models/auxiliar/query/auxiliar-response.model';

export interface AuxiliarValueDto {
  id: string;
  title: string;
  alias: string;
  type: FieldType;
  value?: string | null;
}

export interface AlertSummaryDto {
  id: string;
  name: string;
  active: boolean;
}
