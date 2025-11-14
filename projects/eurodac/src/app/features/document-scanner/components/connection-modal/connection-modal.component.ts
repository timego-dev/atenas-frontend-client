import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ConnectionStatus } from '../../types/at10k/ConnectionStatus';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-connection-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, DialogModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './connection-modal.component.html',
})
export class ConnectionModalComponent implements OnInit, OnDestroy {
  @Input() onStatusChange?: Subject<ConnectionStatus>;
  @Output() onReconnectClicked = new EventEmitter<void>();
  @Output() onLeave = new EventEmitter<void>();
  @Output() onReconnected = new EventEmitter<void>();

  displayConnectionLostDialog = false;
  displayReconnectingDialog = false;
  displayConnectingDialog = false;

  private statusChangeSubscription?: Subscription;
  private lastStatusName?: string;

  constructor(protected translate: TranslateService) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  private closeAllDialogs() {
    this.displayConnectionLostDialog = false;
    this.displayReconnectingDialog = false;
    this.displayConnectingDialog = false;
  }

  async reconnect() {
    this.closeAllDialogs();
    this.onReconnectClicked.emit();
  }

  onClickReconnect() {
    this.reconnect();
  }

  onClickClose() {
    this.closeAllDialogs();
    this.onLeave.emit();
  }

  handleLeave() {
    this.onClickClose();
  }

  initializeSubscriptions(): void {
    this.statusChangeSubscription = this.onStatusChange?.subscribe(
      (connectionStatus: ConnectionStatus) => {
        const prevStatus = this.lastStatusName;

        // Actualiza flags de visibilidad según el estado
        this.displayConnectionLostDialog = connectionStatus.name === 'disconnected';
        this.displayReconnectingDialog = connectionStatus.name === 'reconnecting';
        this.displayConnectingDialog = connectionStatus.name === 'connecting';

        // Si volvemos de "reconnecting" a un estado conectado (ningún diálogo visible), dispara onReconnected
        const nowAnyDialogVisible =
          this.displayConnectionLostDialog ||
          this.displayReconnectingDialog ||
          this.displayConnectingDialog;

        if (prevStatus === 'reconnecting' && !nowAnyDialogVisible) {
          this.onReconnected.emit();
        }

        this.lastStatusName = connectionStatus.name;
      }
    );
  }

  ngOnDestroy(): void {
    this.statusChangeSubscription?.unsubscribe();
    this.closeAllDialogs();
  }
}
