import { CredentialsDto, GroupDto, RoleDto } from '../user.shared';

export interface UserResponseDto {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  emailVerified: boolean;
  enabled: boolean;
  totp: boolean;
  credentials?: CredentialsDto[] | null;
  roles?: RoleDto[] | null;
  groups?: GroupDto[] | null;
}
