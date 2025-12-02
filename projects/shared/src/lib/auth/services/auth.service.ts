import { inject, Injectable } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { BaseAuthService } from '../types/BaseAuthService';
import { ConfigurationFileService } from '@shared/services/configuration-file.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements BaseAuthService {
  private oauthService = inject(OAuthService);
  private configService = inject(ConfigurationFileService);

  constructor() {
    this.oauthService.configure(this.configService.getConfig().auth);

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
