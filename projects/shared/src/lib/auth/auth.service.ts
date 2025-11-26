import { Injectable } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { authConfig } from './auth.config';
import { BaseAuthService } from './base-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements BaseAuthService {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);

    this.oauthService.events
      .pipe(
        filter(
          (e: OAuthEvent) =>
            e.type === 'token_expires' ||
            e.type === 'session_terminated' ||
            e.type === 'session_error'
        )
      )
      .subscribe(() => {
        console.warn('[AuthService] Token expirado o sesión terminada → login');
      });
  }

  async init(): Promise<void> {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  get token(): string | null {
    return this.oauthService.getAccessToken();
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  startLoginFlow(): void {
    this.oauthService.initLoginFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }
}
