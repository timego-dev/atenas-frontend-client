import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/atenas-realm',
  clientId: 'bioidenti-cli',
  redirectUri: window.location.origin + '/',
  scope: 'openid profile email',
  responseType: 'code',
  requireHttps: false,
};
