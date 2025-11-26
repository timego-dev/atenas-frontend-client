import {
  ApplicationConfig,
  APP_INITIALIZER,
  importProvidersFrom,
  Injector,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  Type,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTranslateService } from '@ngx-translate/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import {
  UserRepositoryRemoteService,
  UserRepositoryService,
} from '@shared/services/user-repository.service';
import { UserRepositoryMockService } from '@shared/services/mock/user-repository-mock.service';
import { ConfigurationService } from '@shared/services/configuration.service';
import { ConfigurationFileService } from './shared/services/configuration-file.service';
import { BaseDocumentScanner } from './features/document-scanner/types/at10k/BaseDocumentService';
import { DocumentScannerMockService } from './features/document-scanner/services/at10k/document-scanner-mock.service';
import { DocumentScannerService } from './features/document-scanner/services/at10k/document-scanner.service';
import { authInterceptor } from '@shared/auth/auth.interceptor';
import { AuthService } from '@shared/auth/auth.service';
import { AuthMockService } from '@shared/auth/auth-mock.service';
import { BaseAuthService } from '@shared/auth/base-auth.service';

const SERVICE_REGISTRY: Record<string, Type<any>> = {
  // Users
  AuthService: AuthService,
  AuthMockService: AuthMockService,

  // Users
  UserRepositoryRemoteService: UserRepositoryRemoteService,
  UserRepositoryMockService: UserRepositoryMockService,

  // Scanner
  DocumentScannerService: DocumentScannerService,
  DocumentScannerMockService: DocumentScannerMockService,
};

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
    { provide: ConfigurationService, useExisting: ConfigurationFileService },

    provideAppInitializer(() => {
      const configService = inject(ConfigurationFileService);
      return configService.initialize();
    }),

    // AUTH SCANNER
    {
      provide: BaseAuthService,
      useFactory: (configService: ConfigurationFileService, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.auth;
        console.log('config:', config);

        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey] ? SERVICE_REGISTRY[serviceKey] : AuthService; // default
        console.log('Clase seleccionada:', ServiceClass.name);
        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },
    // USER REPOSITORY
    {
      provide: UserRepositoryService,
      useFactory: (configService: ConfigurationFileService, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.user;

        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey]
            ? SERVICE_REGISTRY[serviceKey]
            : UserRepositoryRemoteService; // default
        console.log('Clase seleccionada:', ServiceClass.name);
        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },

    // DOCUMENT SCANNER
    {
      provide: BaseDocumentScanner,
      useFactory: (configService: ConfigurationFileService, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.documentScanner;
        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey]
            ? SERVICE_REGISTRY[serviceKey]
            : DocumentScannerService; // default
        console.log('Clase seleccionada:', ServiceClass.name);
        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
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
