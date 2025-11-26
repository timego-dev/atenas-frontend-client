import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { BaseAuthService } from './base-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(BaseAuthService);

  // 1) Si es el callback OIDC, dejamos pasar siempre
  if (
    state.url.includes('code=') ||
    state.url.includes('session_state=') ||
    state.url.includes('iss=')
  ) {
    console.log('[authGuard] Callback OIDC detectado, permitiendo navegación');
    return true;
  }

  // 2) Si está logado, OK
  if (authService.isLoggedIn()) {
    return true;
  }

  // 3) Si no está logado y no es callback, entonces sí → login
  console.warn('[authGuard] Usuario no logado → login');
  authService.startLoginFlow();
  return false;
};
