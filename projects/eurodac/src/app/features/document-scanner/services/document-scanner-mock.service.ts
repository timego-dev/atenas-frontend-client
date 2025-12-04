import { Injectable } from '@angular/core';
import * as mockData from '../mocks/document-mock.json';
import { BaseDocumentScanner } from '../types/BaseDocumentService';
import { Verification } from '@shared/models/case/command/scanner-dv.dto';
import { CaptureOptions } from '../types/CaptureOptions';
import { DocumentCapturedData, ScannerCapturedData } from '../types/DocumentCaptureData';

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

    return rawData;
  }
}
