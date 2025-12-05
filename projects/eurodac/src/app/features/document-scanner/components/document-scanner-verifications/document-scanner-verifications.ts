import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import {
  VerificationGroup,
  VerificationCode,
  Verification,
} from '@shared/models/case/command/scanner-dv.dto';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-document-scanner-verifications',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChipModule,
    DividerModule,
    TagModule,
    ImageModule,
    TranslateModule,
  ],
  templateUrl: './document-scanner-verifications.html',
})
export class DocumentScannerVerificationsComponent {
  @Input() verifications?: Verification[];

  protected readonly VerificationGroup = VerificationGroup;
  protected readonly VerificationCode = VerificationCode;

  getSeverity(value?: number): 'success' | 'danger' | 'warn' {
    return value === 1 ? 'success' : 'danger';
  }

  getStatusLabel(value?: number): string {
    return value === 1 ? 'OK' : 'FAIL';
  }

  isBase64(value?: string): boolean {
    if (!value || value.length < 100) return false;
    return value.startsWith('/9j/') || value.startsWith('iVBOR');
  }

  getImageSrc(value: string): string {
    if (value.startsWith('data:image')) return value;

    const type = value.startsWith('iVBOR') ? 'png' : 'jpeg';
    return `data:image/${type};base64,${value}`;
  }
}
