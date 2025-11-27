import { inject, Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

import { BaseDocumentScanner } from '../../types/at10k/BaseDocumentService';
import { ConnectionStatus } from '../../types/at10k/ConnectionStatus';
import { DocumentError } from '../../types/at10k/DocumentError';
import { MessageError } from '../../types/at10k/MessageError';
import { ConfigurationService } from '@shared/services/configuration.service';
import { DocumentReaderErrorCodes } from '../../types/at10k/DocumentReaderErrorCodes';
import { CaptureOptions } from '../../types/at10k/CaptureOptions';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class DocumentScannerService extends BaseDocumentScanner {
  private readonly configurationService = inject(ConfigurationService);

  private currentStatus?: ConnectionStatus;
  private connection?: SignalR.Hub.Connection;
  private hubProxy?: SignalR.Hub.Proxy;
  private eventCallbackMap: Map<string, (...args: any[]) => void> = new Map();

  public host?: string = this.configurationService.getConfig().clientService;
  private readonly hubName: string = 'document-reader';

  constructor(private zone: NgZone) {
    super();
    if (!this.onStatusChange) {
      this.onStatusChange = new Subject<ConnectionStatus>();
    }
  }

  getInfo() {
    console.log('Connection Info', {
      connectionId: this.connection?.id,
      state: this.currentStatus,
      hubProxy: this.hubProxy ? 'Proxy Initialized' : 'Proxy Not Initialized',
      eventListenersRegistered: Array.from(this.eventCallbackMap.keys()),
    });
  }

  cleanSubscriptions() {
    this.stopListeningToHubEvents();
    this.clearDocumentReadTimer();
  }

  private stopListeningToHubEvents() {
    if (!this.hubProxy) return;
    this.eventCallbackMap.forEach((callback, eventName) => {
      this.hubProxy!.off(eventName, callback);
    });
    this.eventCallbackMap.clear();
    console.log('SignalR Hub event listeners cleared.');
  }

  async connectar(): Promise<boolean> {
    if (this.connection) {
      console.log('Stopping previous connection...');
      this.connection.stop();
    }
    this.cleanSubscriptions();

    const signalRServerUrl = this.host;
    if (!signalRServerUrl) {
      console.error('SignalR host URL is not defined.');
      return false;
    }

    console.log('Creating new SignalR connection...');
    this.connection = $.hubConnection(signalRServerUrl);
    if (!this.connection) {
      console.error('Failed to create SignalR hub connection object.');
      return false;
    }

    this.connection.logging = true;

    this.hubProxy = this.connection.createHubProxy(this.hubName);
    if (!this.hubProxy) {
      console.error(`Failed to create proxy for hub '${this.hubName}'.`);
      return false;
    }

    this.subscribeToHubEvents();

    return new Promise<boolean>((resolveOuter, rejectOuter) => {
      this.connection!.error((error: SignalR.ConnectionError) => {
        this.zone.run(() => {
          console.error('SignalR connection error:', error);
          this.currentStatus = {
            name: 'disconnected',
            value: $.signalR.connectionState.disconnected,
          };
          if (this.onStatusChange) {
            this.onStatusChange.next(this.currentStatus);
          }
          const isConnecting =
            this.currentStatus?.value === $.signalR.connectionState.connecting ||
            this.currentStatus?.value === $.signalR.connectionState.reconnecting;
          if (isConnecting) {
            rejectOuter(error);
          }
        });
      });

      this.connection!.stateChanged((change: SignalR.StateChanged) => {
        this.zone.run(() => {
          let newStatusName: ConnectionStatus['name'];
          switch (change.newState) {
            case $.signalR.connectionState.connecting:
              newStatusName = 'connecting';
              console.log('SignalR state: connecting');
              break;
            case $.signalR.connectionState.connected:
              newStatusName = 'connected';
              console.log(`SignalR state: connected. Connection ID: ${this.connection?.id}`);
              this.currentStatus = {
                name: newStatusName,
                value: change.newState,
              };
              if (this.onStatusChange) {
                this.onStatusChange.next(this.currentStatus);
              }
              resolveOuter(true);
              return;
            case $.signalR.connectionState.reconnecting:
              newStatusName = 'reconnecting';
              console.log('SignalR state: reconnecting');
              break;
            case $.signalR.connectionState.disconnected:
            default:
              newStatusName = 'disconnected';
              console.log('SignalR state: disconnected');
              if (
                this.connection?.lastError &&
                change.oldState !== $.signalR.connectionState.connected
              ) {
                console.error(
                  'SignalR disconnected with error before full connection:',
                  this.connection.lastError
                );
                rejectOuter(this.connection.lastError);
              }
              break;
          }
          this.currentStatus = { name: newStatusName, value: change.newState };
          if (this.onStatusChange) {
            this.onStatusChange.next(this.currentStatus);
          }
        });
      });

      this.connection!.start({
        transport: ['webSockets', 'serverSentEvents', 'longPolling'],
      })
        .done(() => {
          console.log(
            `SignalR connection to ${this.hubName} started successfully. Connection ID: ${this.connection?.id}`
          );
        })
        .fail((err: any) => {
          this.zone.run(() => {
            console.error(`Failed to start SignalR connection to ${this.hubName}:`, err);
            this.currentStatus = {
              name: 'disconnected',
              value: $.signalR.connectionState.disconnected,
            };
            if (this.onStatusChange) {
              this.onStatusChange.next(this.currentStatus!);
            }
            rejectOuter(err);
          });
        });
    });
  }

  async init(): Promise<void> {
    if (this.isConnected()) {
      console.log(`Calling initialize on connection ${this.connection?.id}`);
      return this.hubProxy!.invoke('initialize').catch((err: unknown) => {
        console.error('Error invoking "initialize":', err);
        throw err;
      });
    }
    console.warn('Cannot init: SignalR not connected.');
    return Promise.resolve();
  }

  private subscribeToHubEvents(): void {
    console.log('Subscribing to hub events...');

    this.subscribeToHubEvent<boolean>('DocumentInit', 'initDocument');
    this.subscribeToHubEvent<any>('DocumentCapture', 'readDocument');
    this.subscribeToHubEvent<DocumentError>('DocumentException', 'exceptionDocument');
    this.subscribeToHubEvent<number>('DocumentPart', 'partDocument');
  }

  private subscribeToHubEvent<T>(eventName: string, actionNameOnListener: string) {
    if (!this.hubProxy) {
      console.warn(`Cannot subscribe to '${eventName}', hubProxy is not initialized.`);
      return;
    }

    if (this.eventCallbackMap.has(eventName)) {
      console.warn(`Already subscribed to event '${eventName}'. Skipping.`);
      return;
    }

    const callback = (data: T) => {
      console.log(`=== SignalR event '${eventName}' received ===`);
      console.log('Raw data received:', data);
      console.log('Connection ID:', this.connection?.id);
      console.log('Connection State:', this.connection?.state);

      this.zone.run(() => {
        if (
          this.documentListener &&
          typeof (this.documentListener as any)[actionNameOnListener] === 'function'
        ) {
          console.log(`Calling ${actionNameOnListener} with data:`, data);
          try {
            ((this.documentListener as any)[actionNameOnListener] as (param: T) => void)(data);
          } catch (error) {
            console.error(`Error executing ${actionNameOnListener}:`, error);
          }
        } else {
          console.warn(
            `documentListener or action '${actionNameOnListener}' not found or not a function for event '${eventName}'.`
          );
          console.log('documentListener:', this.documentListener);
          console.log(
            'Available methods:',
            this.documentListener
              ? Object.getOwnPropertyNames(Object.getPrototypeOf(this.documentListener))
              : 'none'
          );
        }
      });
    };

    this.hubProxy.on(eventName, callback);
    this.eventCallbackMap.set(eventName, callback);
    console.log(`Successfully subscribed to SignalR event: ${eventName}`);
  }

  async documentStart(config: CaptureOptions): Promise<void> {
    this.clearDocumentReadTimer();

    this.readDocumentTimer = window.setTimeout(() => {
      (async () => {
        this.readDocumentTimer = undefined;
        const errorMessage = new MessageError(DocumentReaderErrorCodes.TIMEOUT);
        const error = new DocumentError();
        error.message = JSON.stringify(errorMessage);
        if (
          this.documentListener &&
          typeof this.documentListener.exceptionDocument === 'function'
        ) {
          this.documentListener.exceptionDocument(error);
        }
        await this.documentStop();
      })();
    }, (config.identificationTimeout || 5) * 1000);

    if (this.isConnected()) {
      console.log(
        `Calling document-capture-start on connection ${this.connection?.id} with config:`,
        config
      );
      return this.hubProxy!.invoke('document-capture-start', config).catch((err: unknown) => {
        console.error('Error invoking "document-capture-start":', err);
        throw err;
      });
    }
    console.warn('Cannot documentStart: SignalR not connected.');
    return Promise.resolve();
  }

  async documentStop(): Promise<void> {
    this.clearDocumentReadTimer();

    if (this.isConnected()) {
      console.log(`Calling document-capture-end on connection ${this.connection?.id}`);
      return this.hubProxy!.invoke('document-capture-end').catch((err: unknown) => {
        console.error('Error invoking "document-capture-end":', err);
        throw err;
      });
    }
    console.warn('Cannot documentStop: SignalR not connected.');
    return Promise.resolve();
  }

  private clearDocumentReadTimer() {
    if (this.readDocumentTimer) {
      clearTimeout(this.readDocumentTimer);
      this.readDocumentTimer = undefined;
    }
  }

  async calibrar(): Promise<void> {
    if (this.isConnected()) {
      return this.hubProxy!.invoke('calibrate').catch((err: unknown) => {
        console.error('Error invoking "calibrate":', err);
        throw err;
      });
    }
    console.warn('Cannot calibrar: SignalR not connected.');
    return Promise.resolve();
  }

  private isConnected(): boolean {
    return this.connection?.state === $.signalR.connectionState.connected;
  }

  ngOnDestroy() {
    console.log('DocumentScannerService ngOnDestroy: Cleaning up...');
    this.cleanSubscriptions();
    if (this.connection) {
      this.connection.stop();
      console.log('SignalR connection stopped in ngOnDestroy.');
    }
  }
}
