import { Component, computed, signal } from '@angular/core';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MappedMultipartAtenas, ScannerDvMapper } from '../../mappers/atenas/scanner-dv.mapper';
import { ImgSrcPipe } from '../../../../shared//pipes/img-src.pipe';
import { ProbabilityPipe } from '../../../../shared/pipes/probability.pipe';
import { nowMs } from '../../../../shared/utils/time';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentScannerModalWrapperComponent } from '../../components/document-scanner-modal-wrapper/document-scanner-modal-wrapper.component';
import { DocumentVerificationData } from '@shared/models/case/command/scanner-dv.dto';
import { ActivityType } from '@shared/models/case/case.enums';
import { ScannerCapturedData } from '../../types/at10k/DocumentCaptureData';
import { CaseRepositoryService } from '@shared/services/case-repository.service';

@Component({
  selector: 'demo-document-scanner',
  standalone: true,
  imports: [
    // Angular
    NgIf,
    NgFor,
    JsonPipe,
    // PrimeNG
    ToolbarModule,
    CardModule,
    ButtonModule,
    DividerModule,
    ChipModule,
    DynamicDialogModule,
    ImageModule,
    // Translations
    TranslateModule,
    // Pipes
    ImgSrcPipe,
    ProbabilityPipe,
  ],
  providers: [DialogService],
  templateUrl: './demo-document-scanner.page.html',
})
export class DemoDocumentScannerPage {
  title = 'AT10K';

  lastEvent = signal<'idle' | 'captured' | 'error' | 'leave'>('idle');
  errorMessage = signal<string | null>(null);

  captured = signal<ScannerCapturedData | null>(null);

  convertedPayload = signal<any | null>(null);
  multipartFileNames = signal<string[]>([]);

  hasAnyImage = computed(() => {
    const imgs = this.captured()?.documentData?.images;
    return !!(imgs?.viz || imgs?.uv || imgs?.ir || imgs?.backVIZ || imgs?.backUV || imgs?.backIR);
  });

  verifications = computed<DocumentVerificationData[]>(
    () => this.captured()?.documentData?.verificationData ?? []
  );

  private dialogRef?: DynamicDialogRef<DocumentScannerModalWrapperComponent> | null;

  constructor(
    private dialogService: DialogService,
    private caseRepositoryService: CaseRepositoryService
  ) {}

  openScannerModal(): void {
    this.dialogRef = this.dialogService.open(DocumentScannerModalWrapperComponent, {
      showHeader: false,
      modal: true,
      closable: true,
      dismissableMask: false,
      contentStyle: {
        padding: '0',
        overflow: 'hidden',
        background: 'transparent',
      },
    });

    this.dialogRef?.onClose.subscribe((result) => {
      if (result?.status === 'captured') this.onCaptured(result.data);
      else if (result?.status === 'error') this.onError(result.error);
      else this.onLeave();
    });
  }

  onCaptured = (data: ScannerCapturedData) => {
    this.captured.set(data);
    this.errorMessage.set(null);
    this.lastEvent.set('captured');
    this.updateConversionPreview();
  };

  onLeave = () => {
    this.lastEvent.set('leave');
  };

  onError = (msg: string) => {
    this.errorMessage.set(msg ?? 'Error desconocido');
    this.lastEvent.set('error');
  };

  private updateConversionPreview() {
    const data = this.captured();
    if (!data) {
      this.convertedPayload.set(null);
      this.multipartFileNames.set([]);
      return;
    }

    const attachPrefix = 'AT10K_Attach';
    const mapped: MappedMultipartAtenas = ScannerDvMapper.mapToMultipartAtenas(data, attachPrefix, {
      inputType: ActivityType.CONSULTATION,
      text: 'Please verify the attached documents.',
      attachmentName: 'AT10K_Scan_01',
    });

    this.convertedPayload.set(mapped.atenasInput);
    this.multipartFileNames.set(mapped.files.map((f) => f.name));
  }

  submitToEndpoint() {
    const data = this.captured();
    if (!data) return;

    const mapped = ScannerDvMapper.mapToMultipartAtenas(data, 'AT10K_Attach', {
      inputType: ActivityType.CONSULTATION,
      text: 'Please verify the attached documents.',
      attachmentName: 'AT10K_Scan_01',
    });
    this.caseRepositoryService.create(mapped.atenasInput, mapped.files).subscribe({
      next: (res) => console.log('[App] POST OK:', res),
      error: (err) => {
        console.error('[App] POST ERROR:', err);
        this.errorMessage.set('Error enviando el caso');
        this.lastEvent.set('error');
      },
    });
  }
}
