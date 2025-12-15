import { FieldType } from '../query/auxiliar-response.model';

export interface AuxiliarRequestDto {
  alias: string;
  title: string;
  type: FieldType;
  required: boolean;

  // Optional constraints depending on type
  minValue?: number;
  maxValue?: number;
  decimals?: number;
  maxLength?: number;

  options?: AuxiliarRequestOptionDto[] | undefined;
}

export interface AuxiliarRequestOptionDto {
  code: string;
  description: string;
}

export interface AuxiliarValueRequestDto {
  id: string;
  alias: string;
  value: string;
}
