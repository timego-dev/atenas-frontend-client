import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';

import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserRepositoryService } from '@shared/services/user-repository.service';
import { UserRepositoryMockService } from '@shared/services/mock/user-repository-mock.service';
import { ConfigurationService } from '@shared/services/configuration.service';
import { ConfigurationFileService } from './shared/services/configuration-file.service';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
dayjs.extend(relativeTime);
dayjs.locale('es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    provideAppInitializer(() => {
      const configService = inject(ConfigurationFileService);
      return configService.initialize();
    }),
    {
      provide: UserRepositoryService,
      useClass: UserRepositoryMockService,
    },
    {
      provide: ConfigurationService,
      useClass: ConfigurationFileService,
    },
  ],
};
