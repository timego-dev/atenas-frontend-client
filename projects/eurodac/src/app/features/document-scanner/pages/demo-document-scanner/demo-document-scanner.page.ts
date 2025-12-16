import { Component, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MappedMultipartAtenas, ScannerDvMapper } from '../../mappers/scanner-dv.mapper';
import { ProbabilityPipe } from '../../../../shared/pipes/probability.pipe';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { DocumentScannerCaptureComponent } from '../../components/document-scanner-capture/document-scanner-capture.component';
import { Verification } from '@shared/models/case/command/scanner-dv.dto';
import { ActivityType } from '@shared/models/case/case.enums';
import { ScannerCapturedData } from '../../types/DocumentCaptureData';
import { CaseRepositoryService } from '@shared/services/case-repository.service';
import { DocumentImagesComponent } from '../../components/document-images/document-images';
import { DocumentMrzComponent } from '../../components/document-mrz/document-mrz';
import { DocumentScannerVerificationsComponent } from '../../components/document-scanner-verifications/document-scanner-verifications';

@Component({
  selector: 'demo-document-scanner',
  standalone: true,
  imports: [
    // PrimeNG
    ToolbarModule,
    CardModule,
    ButtonModule,
    DividerModule,
    ChipModule,
    DynamicDialogModule,
    ImageModule,
    PanelModule,
    // Translations
    TranslateModule,
    // Pipes
    ProbabilityPipe,
    // Components
    DocumentImagesComponent,
    DocumentMrzComponent,
    DocumentScannerVerificationsComponent,
    DocumentScannerCaptureComponent,
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
  isScannerModalVisible = signal<boolean>(false);

  verifications = computed<Verification[] | undefined>(
    () => this.captured()?.documentVerifications?.verifications
  );

  constructor(private caseRepositoryService: CaseRepositoryService) {}

  openScannerModal(): void {
    this.isScannerModalVisible.set(true);
  }

  onCaptured = (data: ScannerCapturedData) => {
    this.isScannerModalVisible.set(false);
    this.captured.set(data);
    this.errorMessage.set(null);
    this.lastEvent.set('captured');
    this.updateConversionPreview();
  };

  onLeave = () => {
    this.isScannerModalVisible.set(false);
    console.log('Scanner modal closed without capture');
    this.lastEvent.set('leave');
  };

  onError = (msg: string) => {
    this.isScannerModalVisible.set(false);
    console.error('Scanner error:', msg);
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
