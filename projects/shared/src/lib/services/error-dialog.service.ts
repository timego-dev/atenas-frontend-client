import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorDialogService {
  private readonly _requests = new Subject<ErrorDialogModel>();
  readonly requests$ = this._requests.asObservable();

  showDialog(model: ErrorDialogModel) {
    this._requests.next(model);
  }
}

export class ErrorDialogModel {
  title?: string;
  text?: string;
  detail?: string | Array<string>;
  tryAgain?: () => Promise<void>;
}
