// shared/auth/auth.mock.service.ts
import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthService {
  async init(): Promise<void> {
    console.log('[MockAuthService] init(): salto login real, modo mock');
  }

  get token(): string | null {
    return 'FAKE_MOCK_TOKEN';
  }

  startLoginFlow(): void {
    console.log('[MockAuthService] startLoginFlow(): noop (mock)');
  }

  logout(): void {
    console.log('[MockAuthService] logout(): noop (mock)');
  }
}
