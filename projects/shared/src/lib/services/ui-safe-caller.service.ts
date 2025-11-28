import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorDialogModel, ErrorDialogService } from './error-dialog.service';

@Injectable({ providedIn: 'root' })
export class UiSafeCallerService {
  private readonly errorDialogService = inject(ErrorDialogService);

  callWithErrorHandling<T>(title: string, operation: () => Observable<T>): Observable<T> {
    return operation().pipe(
      catchError((err) => {
        this.errorDialogService.showDialog(<ErrorDialogModel>{
          title: title,
          text: 'Se ha producido un problema y no ha sido posible realizar la acción seleccionada',
          detail: this.getNiceErrorMessage(err),
        });

        return throwError(() => err);
      })
    );
  }

  private getNiceErrorMessage(err: any): string {
    if (!err) return 'Error desconocido';
    if (err.error?.message) return err.error.message;
    if (err.error) return err.error;
    if (err.message) return err.message;

    return 'Error desconocido';
  }
}
