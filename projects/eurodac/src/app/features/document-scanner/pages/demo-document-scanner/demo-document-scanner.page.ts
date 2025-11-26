import { Component, computed, signal } from '@angular/core';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ScannerDVData, DocumentVerificationData } from '../../types/at10k/ScannerDVData';
import { AtenasDvService } from '../../services/atenas/atenas-dv.service';
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
import { ConfigurationService } from '@shared/services/configuration.service';
import { IConfig } from '../../../../shared/services/configuration-file.service';

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

  captured = signal<ScannerDVData | null>(null);

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
    private uploader: AtenasDvService,
    private configurationService: ConfigurationService<IConfig>
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

  onCaptured = (data: ScannerDVData) => {
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
      includeVerifications: true,
      groupCodeMode: 'numeric',
      inputType: 'CONSULTATION',
      text: 'Please verify the attached documents.',
      creationDate: nowMs(),
      attachmentName: 'AT10K_Scan_01',
    });

    this.convertedPayload.set(mapped.atenasInput);
    this.multipartFileNames.set(mapped.files.map((f) => f.filename));
  }

  submitToEndpoint() {
    const data = this.captured();
    if (!data) return;

    const url = `${this.configurationService.getConfig().backend}/case`;
    this.uploader
      .submit(url, data, 'AT10K_Attach', {
        includeVerifications: true,
        groupCodeMode: 'numeric',
        inputType: 'CONSULTATION',
        text: 'Please verify the attached documents.',
        creationDate: nowMs(),
        attachmentName: 'AT10K_Scan_01',
      })
      .subscribe({
        next: (res) => console.log('[App] POST OK:', res),
        error: (err) => {
          console.error('[App] POST ERROR:', err);
          this.errorMessage.set('Error enviando el caso');
          this.lastEvent.set('error');
        },
      });
  }
}
