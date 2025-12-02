export interface UserRequestDto {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  enabled: boolean;
}

export function createEmptyUserRequest(): UserRequestDto {
  return {
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    enabled: false,
  };
}
