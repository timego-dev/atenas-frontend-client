export class AlertResponseDto {
  id: string = ''; // Guid in C# becomes string in TS
  name: string = '';
  lastModifiedBy: string = '';
  lastModifiedAt: Date = new Date();
  filtersAQL: string = '';
  active: boolean = false;

  constructor(init?: Partial<AlertResponseDto>) {
    Object.assign(this, init);
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
