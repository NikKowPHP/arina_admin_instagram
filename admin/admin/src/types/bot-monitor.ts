export interface BotHealthStatus {
  lastCheck: Date;
  lastPing: Date;
  storageUsage: number;
  mediaCacheCount: number;
  status: string;
  uptime: number;
  isHealthy: boolean;
  errorCount: number;
  authBreaches?: number;
}

export interface ActivityEvent {
  type: string;
  timestamp: Date;
  details: Record<string, unknown>;
}