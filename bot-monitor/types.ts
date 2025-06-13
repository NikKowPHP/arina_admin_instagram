export interface BotHealthStatus {
  lastPing: Date;
  isHealthy: boolean;
  errorCount: number;
}

export interface ActivityEvent {
  type: 'message' | 'error' | 'response';
  timestamp: Date;
  details: string;
}