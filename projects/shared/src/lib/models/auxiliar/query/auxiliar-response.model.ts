import { AuxiliarRequestDto } from "../command/auxiliar-request.model";

export interface AuxiliarResponseDto {
  id: string; // Guid as string
  alias: string;
  title: string;
  type: FieldType;
  required: boolean;
  creationDate: Date;

  // Optional constraints depending on type
  minValue?: number | null;
  maxValue?: number | null;
  decimals?: number | null;
  maxLength?: number | null;

  options: AuxiliarResponseOptionDto[];
}

export interface AuxiliarFilterOptions {
  alias?: string;
  title?: string;
  type?: FieldType;
  required?: boolean;
  creationDateFrom?: Date;
  creationDateTo?: Date;
}

export interface AuxiliarResponseOptionDto {
  code: string;
  description: string;
}

// field-type.enum.ts
export enum FieldType {
  CurrencyEuro = 'CurrencyEuro',
  Integer = 'Integer',
  Numeric = 'Numeric',
  Text = 'Text',
  List = 'List',
}

export function createEmptyAuxiliarRequest(): AuxiliarRequestDto {
  return {
    alias: '',
    title: '',
    type: FieldType.Text,
    required: false,
    minValue: undefined,
    maxValue: undefined,
    decimals: undefined,
    maxLength: undefined,
    options: [],
  }
}
