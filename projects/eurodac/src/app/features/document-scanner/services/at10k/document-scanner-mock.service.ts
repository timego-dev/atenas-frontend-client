import { Injectable } from '@angular/core';
import * as mockData from '../../mocks/document-scanner/document-mock.json';
import { BaseDocumentScanner } from '../../types/at10k/BaseDocumentService';
import { Verification } from '@shared/models/case/command/scanner-dv.dto';
import { CaptureOptions } from '../../types/at10k/CaptureOptions';
import { DocumentCapturedData, ScannerCapturedData } from '../../types/at10k/DocumentCaptureData';

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

  private createDocumentCaptureMock(): ScannerCapturedData {
    const rawData = JSON.parse(JSON.stringify(mockData)) as ScannerCapturedData;

    let processedVerifications: Verification[] = [];

    if (
      rawData.documentVerifications &&
      Array.isArray(rawData.documentVerifications.verifications)
    ) {
      processedVerifications = rawData.documentVerifications.verifications.map(
        (rawVerification: any) => {
          return {
            group: rawVerification.group,
            code: rawVerification.code,
            value: rawVerification.value,
            sourceMessage: rawVerification.sourceMessage,
            expected: rawVerification.expected,
            result: rawVerification.result,
          } as Verification;
        }
      );

      if (processedVerifications.length >= 3) {
        processedVerifications[0].value = this.hasErrors ? 0 : 1;
        processedVerifications[1].value = this.hasErrors ? 0 : 1;
        processedVerifications[2].value = this.hasErrors ? 0 : 1;
      }
    }

    const documentCapture = {
      documentData: rawData.documentData as DocumentCapturedData,
      documentVerifications: processedVerifications,
    } as ScannerCapturedData;

    return documentCapture;
  }
}
