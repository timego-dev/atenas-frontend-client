import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  output,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Tipos y Servicios
import { BaseDocumentScanner, IDocumentListener } from '../../types/BaseDocumentService';
import { DocumentError } from '../../types/DocumentError';
import { MessageError } from '../../types/MessageError';
import { CaptureOptions } from '../../types/CaptureOptions';
import { ScannerCapturedData } from '../../types/DocumentCaptureData';

// Componentes
import { ConnectionModalComponent } from '../connection-modal/connection-card.component';
import { DocumentImagesComponent } from '../../components/document-images/document-images';
import { DocumentMrzComponent } from '../../components/document-mrz/document-mrz';
import { DocumentScannerVerificationsComponent } from '../../components/document-scanner-verifications/document-scanner-verifications';

@Component({
  selector: 'app-document-scanner-capture',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardModule,
    ProgressSpinnerModule,
    ButtonModule,
    TabsModule,
    ConnectionModalComponent,
    DocumentImagesComponent,
    DocumentMrzComponent,
    DocumentScannerVerificationsComponent,
  ],
  templateUrl: './document-scanner-capture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentScannerCaptureComponent implements OnInit, OnDestroy, IDocumentListener {
  // Outputs
  onLeave = output<void>();
  onCaptured = output<ScannerCapturedData>();
  handleErrors = output<string>();

  // Signals
  textInstruccions = signal<string>('');
  isCaptureEnabled = signal<boolean>(false);
  isConnectionBlocking = signal<boolean>(false);

  // Signals para el modo revisión
  isReviewMode = signal<boolean>(false);
  capturedData = signal<ScannerCapturedData | null>(null);

  // Computados para pasar datos limpios a los hijos
  currentImages = computed(() => this.capturedData()?.documentData?.images);
  currentMrz = computed(() => this.capturedData()?.documentData?.mrz);
  currentVerifications = computed(() => this.capturedData()?.documentVerifications?.verifications);

  // Properties
  private isFirstFaceRead: boolean = true;

  // Inyección
  private readonly documentService = inject(BaseDocumentScanner);
  private readonly translate = inject(TranslateService);

  readonly onStatusChange = this.documentService.onStatusChange;

  constructor() {
    this.documentService.setListener(this);
    this.translate
      .get('document.wait-initialization')
      .pipe(take(1))
      .subscribe((v) => this.textInstruccions.set(v));
  }

  async ngOnInit() {
    await this.connectSignalR();
  }

  ngOnDestroy() {
    void this.documentService.documentStop();
  }

  private async connectSignalR() {
    try {
      this.textInstruccions.set(this.translate.instant('document.wait-initialization'));
      const connected = await this.documentService.connectar();
      if (connected) {
        await this.documentService.init();
      } else {
        this.handleErrors.emit(this.translate.instant('document.error.error-connection'));
      }
    } catch {
      this.handleErrors.emit(this.translate.instant('document.error.error-document-msg'));
    }
  }

  initDocument(value: boolean) {
    this.textInstruccions.set(this.translate.instant('document.capture'));
    this.isCaptureEnabled.set(true);
  }

  readDocument(document: ScannerCapturedData) {
    void this.documentService.documentStop().then(() => {
      this.capturedData.set(document);
      this.isReviewMode.set(true);
    });
  }

  confirmCapture() {
    const data = this.capturedData();
    if (data) {
      this.onCaptured.emit(data);
    }
  }

  cancelReview() {
    this.onLeave.emit();
  }

  partDocument(value: number) {
    if (this.isFirstFaceRead) {
      this.isFirstFaceRead = false;
      this.textInstruccions.set(this.translate.instant('document.reading-placeholder'));
    } else {
      this.textInstruccions.set(this.translate.instant('document.change-side'));
    }
  }

  exceptionDocument(documentError: DocumentError) {
    void this.documentService.documentStop().then(() => this.manageError(documentError));
  }

  handleLeaveClick() {
    this.onLeave.emit();
  }

  handleBlockingUiChange(blocking: boolean) {
    this.isConnectionBlocking.set(blocking);
  }

  async handleContinue() {
    this.isCaptureEnabled.set(false);
    await this.startDocumentCapture();
  }

  private async manageError(documentError: DocumentError) {
    let error: MessageError | null = null;
    try {
      error = documentError?.message ? JSON.parse(documentError.message) : null;
    } catch {}

    if (!error) {
      this.handleErrors.emit(this.translate.instant('document.error.message'));
      return;
    }
    this.handleErrors.emit(this.translate.instant('document.error.message'));
  }

  private async startDocumentCapture() {
    try {
      const config: CaptureOptions = {
        lecturaChip: true,
        verificaChip: true,
        verificaImagenes: true,
        identificationTimeout: 300,
      };
      await this.documentService.documentStart(config);
    } catch {
      this.handleErrors.emit(this.translate.instant('document.error.error-document-msg'));
    }
  }

  async reconnect() {
    try {
      if (this.documentService.readDocumentTimer) {
        clearTimeout(this.documentService.readDocumentTimer);
        this.documentService.readDocumentTimer = undefined;
      }
      this.isCaptureEnabled.set(false);
      this.isFirstFaceRead = true;
      this.textInstruccions.set(this.translate.instant('document.wait-initialization'));
      await this.connectSignalR();
    } catch {
      this.handleErrors.emit(this.translate.instant('document.error.error-document-msg'));
    }
  }
}
