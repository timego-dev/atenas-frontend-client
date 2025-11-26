/*
  Intercepta todas las peticiones HTTP y, si el usuario está autenticado,
  añade automáticamente el token de acceso (JWT) al header Authorization.
  Si no hay token o la API responde 401/403, redirige al login.
*/

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { BaseAuthService } from './base-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(BaseAuthService);

  const isI18n = req.url.includes('/i18n/') || req.url.endsWith('.json');
  const isAsset = req.url.startsWith('/assets/');
  const isIssuer = req.url.startsWith('http://localhost:8080');
  const isOidcMeta =
    req.url.includes('/.well-known/openid-configuration') ||
    req.url.includes('/protocol/openid-connect');

  if (isAsset || isI18n || isIssuer || isOidcMeta || req.headers.has('X-Skip-Auth')) {
    return next(req);
  }

  const token = authService.token;

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend responde 401/403, asumimos token caducado o inválido
      if (error.status === 401 || error.status === 403) {
        console.warn('[authInterceptor] 401/403 detectado, redirigiendo a login');
        authService.startLoginFlow();
      }

      return throwError(() => error);
    })
  );
};
