import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  output,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseDocumentScanner, IDocumentListener } from '../../types/at10k/BaseDocumentService';
import { DocumentError } from '../../types/at10k/DocumentError';
import { MessageError } from '../../types/at10k/MessageError';
import { CommonModule } from '@angular/common';
import { ConnectionModalComponent } from '../connection-modal/connection-card.component';
import { take } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DocumentReaderErrorCodes } from '../../types/at10k/DocumentReaderErrorCodes';
import { CaptureOptions } from '../../types/at10k/CaptureOptions';
import { ScannerCapturedData } from '../../types/at10k/DocumentCaptureData';

@Component({
  selector: 'app-document-scanner-capture',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardModule, ButtonModule, ConnectionModalComponent],
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

  // Properties
  private isFirstFaceRead: boolean = true;
  private isFirstCaptureTry: boolean = true;

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
    void this.documentService.documentStop().then(() => this.onCaptured.emit(document));
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

    let msg = this.translate.instant('document.error.message');
    switch (error.ErrorCode) {
      case DocumentReaderErrorCodes.DISCONNECT:
        msg = this.translate.instant('document.error.message-disconnect');
        break;
      case DocumentReaderErrorCodes.NOTCAPTURING:
        msg = this.translate.instant('document.error.message-not-capture');
        break;
      case DocumentReaderErrorCodes.TIMEOUT:
        msg = this.translate.instant('document.error.message-timeout');
        await this.reconnect();
        break;
      case DocumentReaderErrorCodes.UNINITIALIZE:
        msg = this.translate.instant('document.error.message-not-init');
        break;
      case DocumentReaderErrorCodes.YETINITIALIZE:
        msg = this.translate.instant('document.error.message-already-started');
        break;
      case DocumentReaderErrorCodes.VALIDATION:
        if (this.isFirstCaptureTry) {
          this.isFirstCaptureTry = false;
          await this.reconnect();
          this.isCaptureEnabled.set(false);
          await this.startDocumentCapture();
          return;
        }
        break;
    }
    this.handleErrors.emit(msg);
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
      this.handleErrors.emit(
        this.translate.instant('document.error.error-document-msg') +
          '. ' +
          this.translate.instant('document.error.error-document-instructions')
      );
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
