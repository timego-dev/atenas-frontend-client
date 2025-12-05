export class AlertRequestDto {
  name: string = '';
  filtersAQL: string = '';
  active: boolean = false;

  constructor(init?: Partial<AlertRequestDto>) {
    Object.assign(this, init);
  }
}
