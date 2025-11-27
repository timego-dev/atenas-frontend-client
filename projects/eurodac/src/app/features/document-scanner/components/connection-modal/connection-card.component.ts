import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ConnectionStatus } from '../../types/ConnectionStatus';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-connection-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './connection-card.component.html',
})
export class ConnectionModalComponent implements OnInit, OnDestroy {
  @Input() onStatusChange?: Subject<ConnectionStatus>;
  @Output() onReconnectClicked = new EventEmitter<void>();
  @Output() onLeave = new EventEmitter<void>();
  @Output() onReconnected = new EventEmitter<void>();
  @Output() blockingUiChange = new EventEmitter<boolean>();

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
    this.blockingUiChange.emit(false);
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

        this.displayConnectionLostDialog = connectionStatus.name === 'disconnected';
        this.displayReconnectingDialog = connectionStatus.name === 'reconnecting';
        this.displayConnectingDialog = connectionStatus.name === 'connecting';

        const nowAnyDialogVisible =
          this.displayConnectionLostDialog ||
          this.displayReconnectingDialog ||
          this.displayConnectingDialog;

        this.blockingUiChange.emit(nowAnyDialogVisible);

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
