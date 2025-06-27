export interface BotHealthStatus {
  lastPing: Date;
  isHealthy: boolean;
  errorCount: number;
  storageUsage?: number; // MB
  authBreaches?: number;
}

export interface ActivityEvent {
  type: 'message' | 'error' | 'response' | 'warning' | 'storage' | 'auth';
  timestamp: Date;
  details: string;
  metadata?: {
    responseTime?: number;
    recipient?: string;
    messageId?: string;
    errorStack?: string;
    content?: string;
    storagePath?: string;
    userId?: string;
  };
}

export interface RateLimitConfig {
  maxEvents: number;
  timeWindow: number; // in milliseconds
}