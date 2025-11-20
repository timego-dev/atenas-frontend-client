

// field-type.enum.ts
export enum FieldType {
  CurrencyEuro = 'CurrencyEuro',
  Integer = 'Integer',
  Numeric = 'Numeric',
  Text = 'Text',
  List = 'List',
}


export interface PostAuxiliar {
  alias: string;
  title: string;
  type: FieldType;
  required: boolean;
  creationDate: Date;

  // Optional constraints depending on type
  minValue?: number;
  maxValue?: number;
  decimals?: number;
  maxLength?: number;

  options: PostAuxiliarOption[];
}

export interface PostAuxiliarOption {
  code: string;
  description: string;
}