export interface BotHealthStatus {
  lastPing: Date;
  isHealthy: boolean;
  errorCount: number;
}

export interface ActivityEvent {
  type: 'message' | 'error' | 'response' | 'warning';
  timestamp: Date;
  details: string;
  metadata?: {
    responseTime?: number;
    recipient?: string;
    messageId?: string;
    errorStack?: string;
    content?: string;
  };
}

export interface RateLimitConfig {
  maxEvents: number;
  timeWindow: number; // in milliseconds
}