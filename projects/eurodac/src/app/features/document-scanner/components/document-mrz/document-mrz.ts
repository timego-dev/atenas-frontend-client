import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-document-mrz',
  standalone: true,
  imports: [CardModule, FieldsetModule],
  templateUrl: './document-mrz.html',
})
export class DocumentMrzComponent {
  // Ajusta el tipo 'any' a tu interfaz de MRZ si la tienes exportada
  @Input() data: any | null = null;
}
