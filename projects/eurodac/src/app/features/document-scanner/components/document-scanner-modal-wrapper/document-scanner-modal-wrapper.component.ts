import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentScannerCaptureComponent } from '../document-scanner-capture/document-scanner-capture.component';
import { ScannerDVData } from '../../types/at10k/ScannerDVData';

@Component({
  selector: 'app-document-scanner-modal-wrapper',
  standalone: true,
  imports: [DocumentScannerCaptureComponent],
  templateUrl: './document-scanner-modal-wrapper.component.html',
})
export class DocumentScannerModalWrapperComponent {
  constructor(public ref: DynamicDialogRef) {}

  onCaptured(data: ScannerDVData) {
    this.ref.close({ status: 'captured', data });
  }

  onLeave() {
    this.ref.close({ status: 'leave' });
  }

  onError(msg: string) {
    // this.ref.close({ status: 'error', error: msg });
  }
}
