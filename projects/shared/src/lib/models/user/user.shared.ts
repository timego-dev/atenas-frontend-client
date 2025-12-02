export interface CredentialsDto {
  type: string; // "password"
  value: string;
  temporary: boolean;
}

export interface RoleDto {
  id: string; // Guid
  name: RoleType;
}

export interface GroupDto {
  id: string; // Guid
  name: string;
}

export enum RoleType {
  OPERATOR = 'OPERATOR',
  SUPERVISOR = 'SUPERVISOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  ATENAS_CLIENT = 'ATENAS_CLIENT',
  EURODAC_CLIENT = 'EURODAC_CLIENT',
  MBI_CLIENT = 'MBI_CLIENT',
}
