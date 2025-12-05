export interface UserRequestDto {
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  enabled: boolean;
}

export function createEmptyUserRequest(): UserRequestDto {
  return {
    username: '',
    firstName: null,
    lastName: null,
    email: '',
    enabled: false,
  };
}
