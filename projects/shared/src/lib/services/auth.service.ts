import { RoleType } from '@shared/models/user/user.shared';

export abstract class AuthService {
  /**
   * Devuelve el token actual o null si no hay sesión.
   */
  abstract get token(): string | null;

  /**
   * Inicializa la configuración (oauth, carga de discovery docs, etc).
   */
  abstract init(): Promise<void>;

  abstract isLoggedIn(): boolean;

  /**
   * Inicia el flujo de logueo (redirección a Identity Provider o simulación).
   */
  abstract startLoginFlow(): void;

  /**
   * Cierra la sesión y limpia el almacenamiento.
   */
  abstract logout(): void;

  abstract hasRole(role: RoleType): boolean;

  abstract get userName(): string | null;
}
