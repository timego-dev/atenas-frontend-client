import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { BaseAuthService } from '@shared/auth/base-auth.service';

bootstrapApplication(App, appConfig)
  .then(async (appRef) => {
    const auth = appRef.injector.get(BaseAuthService);

    if ('init' in auth && typeof (auth as any).init === 'function') {
      await (auth as any).init();
    }

    console.log('[main] App iniciada correctamente');
  })
  .catch((err) => console.error('[main] Error al iniciar', err));
