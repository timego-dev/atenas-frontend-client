import { Component, input } from '@angular/core';
import { AthenasMessageDto } from '@shared/models/case/command/athenas-message.dto';

@Component({
  selector: 'case-create',
  standalone: true,
  imports: [],
  templateUrl: './case-create.component.html',
  providers: [],
})
export class CaseCreateComponent {
  athenasMessage = input.required<AthenasMessage>();
}

export interface AthenasMessage {
  athenasMessageDto: AthenasMessageDto;
  files: File[];
}
