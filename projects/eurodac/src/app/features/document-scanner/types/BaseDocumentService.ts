import { Subject } from 'rxjs';

import { DocumentError } from './DocumentError';
import { ConnectionStatus } from './ConnectionStatus';
import { CaptureOptions } from './CaptureOptions';
import { ScannerCapturedData } from './DocumentCaptureData';

export interface IDocumentListener {
  initDocument(state: boolean): void;
  readDocument(document: ScannerCapturedData): void;
  partDocument(face: number): void;
  exceptionDocument(documentError: DocumentError): void;
}

export abstract class BaseDocumentScanner {
  onStatusChange = new Subject<ConnectionStatus>();
  readDocumentTimer?: number;
  documentListener?: IDocumentListener;

  setListener(source: IDocumentListener) {
    this.documentListener = source;
  }

  abstract getInfo(): void;
  abstract init(): Promise<void>;
  abstract connectar(): Promise<boolean>;
  abstract documentStart(config: CaptureOptions): Promise<void>;
  abstract documentStop(): Promise<void>;
  abstract calibrar(): Promise<void>;
}
