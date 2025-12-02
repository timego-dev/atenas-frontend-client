import { Injectable } from '@angular/core';
import { BaseAuthService } from '../types/BaseAuthService';

@Injectable({
  providedIn: 'root',
})
export class AuthMockService implements BaseAuthService {
  async init(): Promise<void> {
    console.log('[MockAuthService] init(): salto login real, modo mock');
  }

  get token(): string | null {
    return 'FAKE_MOCK_TOKEN';
  }

  isLoggedIn(): boolean {
    return true;
  }

  startLoginFlow(): void {
    console.log('[MockAuthService] startLoginFlow(): noop (mock)');
  }

  logout(): void {
    console.log('[MockAuthService] logout(): noop (mock)');
  }
}
