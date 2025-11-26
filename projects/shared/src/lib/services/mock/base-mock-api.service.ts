import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

export abstract class BaseMockApiService {
  protected simulateUnauthorized = false;
  setUnauthorizedMode(value: boolean) {
    this.simulateUnauthorized = value;
  }

  protected ok<T>(body?: T): Observable<T> {
    return of(body as T);
  }

  protected created<T>(body: T): Observable<T> {
    return of(body);
  }

  protected badRequest(errors: string[]): Observable<never> {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: errors,
        })
    );
  }

  protected notFound(): Observable<never> {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 404,
          statusText: 'Not Found',
        })
    );
  }

  protected unauthorized(message: string = 'Unauthorized'): Observable<never> {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: message,
        })
    );
  }

  protected handleUnauthorized<T>(fn: () => Observable<T>): Observable<T> {
    if (this.simulateUnauthorized) {
      return this.unauthorized();
    }
    return fn();
  }
}
