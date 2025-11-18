import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AuthService } from '@shared/auth/auth.service';

bootstrapApplication(App, appConfig).then(async (appRef) => {
  console.log('[main] bootstrapped');
  const auth = appRef.injector.get(AuthService);

  try {
    console.log('[main] calling auth.init()...');
    await auth.init();
    console.log('[main] auth.init() finished');
  } catch (e) {
    console.error('[main] auth.init() FAILED', e);
  }
});
