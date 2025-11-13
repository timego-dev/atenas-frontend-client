import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  template: `<h1>Página no encontrada</h1>`,
})
export class Notfound {}
