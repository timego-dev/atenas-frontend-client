export interface RuleGroup {
  operator: 'AND' | 'OR';
  children: (RuleGroup | RuleClause)[];
}

export interface RuleClause {
  field: string;
  operator: string;
  value: any;
}
export class AlertResponseDto {
  id: string = '';
  name: string = '';
  description: string = '';
  category: string = '';
  nCases: number = 0;
  nCounterfeits: number = 0;
  lastModifiedBy: string = '';
  lastModifiedAt: Date = new Date();
  filtersAQL: string = '';
  active: boolean = false;

  ruleGroup?: RuleGroup;

  constructor(init?: Partial<AlertResponseDto>) {
    Object.assign(this, init);
    if (!this.ruleGroup) {
      this.ruleGroup = { operator: 'AND', children: [] };
    }
  }
}

export class AlertFilterOptions {
  name?: string;
  lastModifiedBy?: string;
  active?: boolean;
  lastModifiedAtFrom?: Date;
  lastModifiedAtTo?: Date;

  constructor(init?: Partial<AlertFilterOptions>) {
    Object.assign(this, init);
  }
}

export class AlertFieldNameDto {
  fieldName: string = '';
  displayName: string = '';
  type?: AlertFieldType;
}

export class AlertCodeListDto {
  code: string = '';
  name: string = '';
}

export enum AlertFieldType {
  CountryList = 'countryList',
  Date = 'date',
  DocTypeList = 'docTypeList',
  SexList = 'sexList',
  Text = 'text',
  Number = 'number',
}
