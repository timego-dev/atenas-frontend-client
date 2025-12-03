import { RoleType } from '@shared/models/user/user.shared';
import { AuthService } from '../auth.service';

export interface AuthMockBehavior {
  isLoggedIn: boolean;
  roles: RoleType[];
  userName: string | null;
}

export class AuthMockService extends AuthService {
  private behavior: AuthMockBehavior = {
    isLoggedIn: true,
    roles: [RoleType.OPERATOR],
    userName: 'mockuser',
  };

  applyBehavior(behavior: Partial<AuthMockBehavior>) {
    Object.assign(this.behavior, behavior);
  }

  resetBehavior(behavior: AuthMockBehavior) {
    this.behavior = behavior;
  }

  override get token(): string | null {
    return null;
  }

  override init(): Promise<void> {
    return Promise.resolve();
  }
  override isLoggedIn(): boolean {
    return this.behavior.isLoggedIn;
  }
  override startLoginFlow(): void {
    return;
  }
  override logout(): void {
    return;
  }
  override hasRole(role: RoleType): boolean {
    return this.isLoggedIn() && this.behavior.roles.includes(role);
  }
  override get userName(): string | null {
    return this.isLoggedIn() ? this.behavior.userName : null;
  }
}
