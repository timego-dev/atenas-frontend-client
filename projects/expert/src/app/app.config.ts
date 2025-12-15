import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injector,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  Type,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  UserRepositoryRemoteService,
  UserRepositoryService,
} from '@shared/services/user-repository.service';
import { UserRepositoryMockService } from '@shared/services/mock/user-repository-mock.service';
import {
  CaseRepositoryRemoteService,
  CaseRepositoryService,
} from '@shared/services/case-repository.service';
import { CaseRepositoryMockService } from '@shared/services/mock/case-repository-mock.service';
import {
  AuxiliarRepositoryRemoteService,
  AuxiliarRepositoryService,
} from '@shared/services/auxiliar-repository.service';
import { AuxiliarRepositoryMockService } from '@shared/services/mock/auxiliar-repository-mock.service';
import { ConfigurationService } from '@shared/services/configuration.service';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { authInterceptor } from '@shared/auth/interceptors/auth.interceptor';
import { AuthService } from '@shared/auth/services/auth.service';
import { AuthMockService } from '@shared/auth/services/auth-mock.service';
import { BaseAuthService } from '@shared/auth/types/BaseAuthService';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { MessageService } from 'primeng/api';
import { ConfigurationFileService } from '@shared/services/configuration-file.service';
import { IConfig } from './shared/types/config';
import {
  AlertRepositoryRemoteService,
  AlertRepositoryService,
} from '@shared/services/alert-repository.service';
import {
  SystemConfigurationRepositoryRemoteService,
  SystemConfigurationRepositoryService,
} from '@shared/services/system-configuration-repository.service';
import { SystemConfigurationRepositoryMockService } from '@shared/services/mock/system-configuration-repository-mock.service';
import { AlertRepositoryMockService } from '@shared/services/mock/alert-repository-mock.service';
dayjs.extend(relativeTime);
dayjs.locale('es');

const SERVICE_REGISTRY: Record<string, Type<any>> = {
  // Auth
  AuthService: AuthService,
  AuthMockService: AuthMockService,

  // User
  UserRepositoryRemoteService: UserRepositoryRemoteService,
  UserRepositoryMockService: UserRepositoryMockService,

  // Case
  CaseRepositoryMockService: CaseRepositoryMockService,
  CaseRepositoryRemoteService: CaseRepositoryRemoteService,

  // Auxiliar
  AuxiliarRepositoryRemoteService: AuxiliarRepositoryRemoteService,
  AuxiliarRepositoryMockService: AuxiliarRepositoryMockService,

  // Alertas
  AlertRepositoryRemoteService: AlertRepositoryRemoteService,
  AlertRepositoryMockService: AlertRepositoryMockService,

  SystemConfigurationRepositoryRemoteService: SystemConfigurationRepositoryRemoteService,
  SystemConfigurationRepositoryMockService: SystemConfigurationRepositoryMockService,
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
    AuthService,
    AuthMockService,
    MessageService,
    UserRepositoryRemoteService,
    UserRepositoryMockService,
    CaseRepositoryMockService,
    CaseRepositoryRemoteService,
    AuxiliarRepositoryRemoteService,
    AuxiliarRepositoryMockService,
    AlertRepositoryRemoteService,
    AlertRepositoryMockService,
    provideAppInitializer(() => {
      const configService = inject(ConfigurationFileService);
      return configService.initialize();
    }),

    // AUTH SERVICE
    {
      provide: BaseAuthService,
      useFactory: (configService: ConfigurationFileService<IConfig>, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.auth;

        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey] ? SERVICE_REGISTRY[serviceKey] : AuthService;

        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },

    // USER REPOSITORY
    {
      provide: UserRepositoryService,
      useClass: UserRepositoryMockService,
      useFactory: (configService: ConfigurationFileService<IConfig>, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.user;

        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey]
            ? SERVICE_REGISTRY[serviceKey]
            : UserRepositoryRemoteService;

        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },

    // CASE REPOSITORY
    {
      provide: CaseRepositoryService,
      useFactory: (configService: ConfigurationFileService<IConfig>, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.case;

        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey]
            ? SERVICE_REGISTRY[serviceKey]
            : CaseRepositoryMockService;

        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },
    // AUXILIAR REPOSITORY
    {
      provide: AuxiliarRepositoryService,
      useClass: AuxiliarRepositoryMockService,
      useFactory: (configService: ConfigurationFileService<IConfig>, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.auxiliar;

        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey]
            ? SERVICE_REGISTRY[serviceKey]
            : AuxiliarRepositoryRemoteService;

        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },
    // ALERT REPOSITORY
    {
      provide: AlertRepositoryService,
      useFactory: (configService: ConfigurationFileService<IConfig>, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.alert;
        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey]
            ? SERVICE_REGISTRY[serviceKey]
            : AlertRepositoryRemoteService; // default
        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },
    // SYSTEM CONFIGURATION REPOSITORY
    {
      provide: SystemConfigurationRepositoryService,
      useFactory: (configService: ConfigurationFileService<IConfig>, injector: Injector) => {
        const config = configService.getConfig();
        const serviceKey = config?.services?.systemConfiguration;
        const ServiceClass =
          serviceKey && SERVICE_REGISTRY[serviceKey]
            ? SERVICE_REGISTRY[serviceKey]
            : SystemConfigurationRepositoryRemoteService; // default
        return injector.get(ServiceClass);
      },
      deps: [ConfigurationFileService, Injector],
    },
    provideAppInitializer(() => {
      const configService = inject(ConfigurationFileService);
      const injector = inject(Injector);

      return configService.initialize().then(() => {
        const authService = injector.get(BaseAuthService);
        return authService.init();
      });
    }),
  ],
};
