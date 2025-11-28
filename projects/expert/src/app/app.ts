import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { ErrorDialogComponent } from '@shared/components/error-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ErrorDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('expert');
}
