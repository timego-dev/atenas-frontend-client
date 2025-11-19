import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserRepositoryService } from '@shared/services/user-repository.service';
import { UserRepositoryMockService } from '@shared/services/mock/user-repository-mock.service';
import { ConfigurationService } from '@shared/services/configuration.service';
import { ConfigurationFileService } from './shared/services/configuration-file.service';
import { BaseDocumentScanner } from './features/document-scanner/types/at10k/BaseDocumentService';
import { provideTranslateService } from '@ngx-translate/core';
import { DocumentScannerMockService } from './features/document-scanner/services/at10k/document-scanner-mock.service';
import { DocumentScannerService } from './features/document-scanner/services/at10k/document-scanner.service';
import { environment } from '../environments/environment';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { authInterceptor } from '@shared/auth/auth.interceptor';
import { AuthService } from '@shared/auth/auth.service';
import { MockAuthService } from '@shared/auth/auth.mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(OAuthModule.forRoot()),
    { provide: OAuthStorage, useFactory: () => localStorage },
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    provideAppInitializer(() => {
      const configService = inject(ConfigurationFileService);
      return configService.initialize();
    }),
    ...(environment.useMockAuth
      ? [
          {
            provide: AuthService,
            useClass: MockAuthService,
          },
        ]
      : [
          {
            provide: AuthService,
            useClass: AuthService,
          },
        ]),
    {
      provide: UserRepositoryService,
      useClass: UserRepositoryMockService,
    },
    {
      provide: ConfigurationService,
      useExisting: ConfigurationFileService,
    },
    {
      provide: BaseDocumentScanner,
      useClass: environment.useDocumentScannerMock
        ? DocumentScannerMockService
        : DocumentScannerService,
    },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'es',
    }),
  ],
};
