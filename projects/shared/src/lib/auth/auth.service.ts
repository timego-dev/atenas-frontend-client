import { Injectable } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { authConfig } from './auth.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    // this.oauthService.setupAutomaticSilentRefresh();

    // 🔹 Escuchar eventos importantes de OAuth
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
        this.startLoginFlow();
      });
  }

  async init(): Promise<void> {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (!this.oauthService.hasValidAccessToken()) {
      this.startLoginFlow();
    }
  }

  get token(): string | null {
    return this.oauthService.getAccessToken();
  }

  startLoginFlow(): void {
    this.oauthService.initLoginFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }
}
