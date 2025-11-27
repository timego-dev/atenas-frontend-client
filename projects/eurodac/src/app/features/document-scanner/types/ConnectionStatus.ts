export interface ConnectionStatus {
  name: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  value: number;
}
