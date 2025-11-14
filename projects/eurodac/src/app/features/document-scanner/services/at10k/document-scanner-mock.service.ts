import { Injectable } from '@angular/core';
import * as mockData from '../../mocks/document-scanner/document-mock.json';
import { BaseDocumentScanner } from '../../types/at10k/BaseDocumentService';
import {
  CaptureOptions,
  DocumentData,
  DocumentVerifications,
  ScannerDVData,
} from '../../types/at10k/ScannerDVData';
import { Verification } from '../../types/at10k/Verification';

@Injectable({
  providedIn: 'root',
})
export class DocumentScannerMockService extends BaseDocumentScanner {
  private timeoutIds: any[] = [];
  public hasErrors: boolean = false;

  getInfo() {
    console.log('Get info mock');
  }
  init(): Promise<void> {
    return new Promise((resolve) => {
      console.log('Document mock init invoked');
      setTimeout(() => {
        this.documentListener?.initDocument(true);
        resolve();
      }, 2000);
    });
  }
  async connectar(): Promise<boolean> {
    return new Promise((resolve) => {
      this.timeoutIds = [];
      console.log('Document mock connectar invoked');
      resolve(true);
    });
  }
  async documentStart(config: CaptureOptions): Promise<void> {
    return new Promise((resolve) => {
      console.log('Document mock document start invoked');
      this.scheduleEvent(() => this.documentListener?.partDocument(0), 1000);
      this.scheduleEvent(() => this.documentListener?.partDocument(1), 2000);
      this.scheduleEvent(
        () => this.documentListener?.readDocument(this.createDocumentCaptureMock()),
        3000
      );
      resolve();
    });
  }
  async documentStop(): Promise<void> {
    return new Promise((resolve) => {
      console.log('Document mock document stop invoked');
      this.timeoutIds.forEach(clearTimeout);
      this.timeoutIds = [];
      resolve();
    });
  }
  async calibrar(): Promise<void> {
    return new Promise(() => {
      console.log('Document mock calibrar invoked');
    });
  }

  private scheduleEvent(action: () => void, delay: number) {
    const timeoutId = setTimeout(() => {
      action();
      this.timeoutIds = this.timeoutIds.filter((id) => id !== timeoutId);
    }, delay);
    this.timeoutIds.push(timeoutId);
  }

  private createDocumentCaptureMock(): ScannerDVData {
    const rawData = JSON.parse(JSON.stringify(mockData));

    let processedVerifications: Verification[] = [];

    if (
      rawData.documentVerifications &&
      Array.isArray(rawData.documentVerifications.verifications)
    ) {
      processedVerifications = rawData.documentVerifications.verifications.map(
        (rawVerification: any) => {
          return new Verification({
            group: rawVerification.group,
            code: rawVerification.code,
            value: rawVerification.value,
            sourceMessage: rawVerification.sourceMessage,
            expected: rawVerification.expected,
            result: rawVerification.result,
          });
        }
      );

      if (processedVerifications.length >= 3) {
        processedVerifications[0].value = this.hasErrors ? 0 : 1;
        processedVerifications[1].value = this.hasErrors ? 0 : 1;
        processedVerifications[2].value = this.hasErrors ? 0 : 1;
      }
    }

    const documentVerificationsInstance = new DocumentVerifications(processedVerifications);

    const documentCapture = new ScannerDVData(
      rawData.documentData as DocumentData,
      documentVerificationsInstance
    );

    return documentCapture;
  }
}
