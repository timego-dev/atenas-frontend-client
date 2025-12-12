import { RuleGroup } from "../query/alert-response.model";

export class AlertRequestDto {
  id: string = '';
  name: string = '';
  description: string = '';
  category: string = '';
  active: boolean = true;
  nCases: number = 0;
  nCounterfeits: number = 0;
  lastModifiedBy: string = '';
  lastModifiedAt: Date = new Date();
  filtersAQL: string = '';
  ruleGroup?: RuleGroup;

  constructor(init?: Partial<AlertRequestDto>) {
    Object.assign(this, init);
    if (!this.ruleGroup) {
      this.ruleGroup = { operator: 'AND', children: [] };
    }
  }
}
