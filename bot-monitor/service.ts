import { BotHealthStatus, ActivityEvent, RateLimitConfig } from './types';

const HEALTH_CHECK_INTERVAL = 30000;
const MAX_CONSECUTIVE_FAILURES = 3;
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxEvents: 1000,
  timeWindow: 60 * 60 * 1000 // 1 hour
};

export class BotMonitor {
  private healthStatus: BotHealthStatus;
  private activityLog: ActivityEvent[] = [];
  private consecutiveFailures = 0;
  private rateLimitConfig: RateLimitConfig;
  private eventCount = 0;
  private lastReset = Date.now();

  constructor(private botEndpoint: string, rateLimit?: RateLimitConfig) {
    this.healthStatus = {
      lastPing: new Date(),
      isHealthy: true,
      errorCount: 0
    };
    this.rateLimitConfig = rateLimit || DEFAULT_RATE_LIMIT;
  }

  start(): void {
    console.log('Bot monitoring service started');
    setInterval(() => this.checkHealth(), HEALTH_CHECK_INTERVAL);
  }

  private async checkHealth(): Promise<void> {
    try {
      const response = await fetch(this.botEndpoint + '/health');
      if (!response.ok) throw new Error('Health check failed');
      
      this.consecutiveFailures = 0;
      this.healthStatus = {
        lastPing: new Date(),
        isHealthy: true,
        errorCount: this.healthStatus.errorCount
      };
    } catch (error) {
      this.consecutiveFailures++;
      this.healthStatus = {
        lastPing: new Date(),
        isHealthy: false,
        errorCount: this.healthStatus.errorCount + 1
      };

      this.trackError(error);

      if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        this.handleCriticalFailure();
      }
    }
  }

  private handleCriticalFailure(): void {
    this.trackActivity({
      type: 'error',
      details: 'Critical failure threshold reached. Initiating recovery.'
    });
    
    // TODO: Implement actual recovery procedures
    console.error('Critical bot failure detected. Recovery needed.');
  }

  private checkRateLimit(): boolean {
    const now = Date.now();
    if (now - this.lastReset > this.rateLimitConfig.timeWindow) {
      this.eventCount = 0;
      this.lastReset = now;
    }
    return this.eventCount < this.rateLimitConfig.maxEvents;
  }

  trackActivity(event: Omit<ActivityEvent, 'timestamp'>): void {
    if (!this.checkRateLimit()) {
      console.warn('Rate limit exceeded for activity tracking');
      return;
    }

    this.eventCount++;
    this.activityLog.push({
      ...event,
      timestamp: new Date()
    });
  }

  trackMessage(content: string, recipient: string, messageId: string): void {
    this.trackActivity({
      type: 'message',
      details: `Message sent to ${recipient}`,
      metadata: {
        recipient,
        messageId,
        content
      }
    });
  }

  trackError(error: Error): void {
    this.trackActivity({
      type: 'error',
      details: error.message,
      metadata: {
        errorStack: error.stack
      }
    });
  }

  trackResponseTime(action: string, responseTime: number): void {
    this.trackActivity({
      type: 'response',
      details: `${action} response time`,
      metadata: {
        responseTime
      }
    });
  }

  getRecentActivity(count = 10): ActivityEvent[] {
    return this.activityLog.slice(-count);
  }

  getCurrentHealth(): BotHealthStatus {
    return this.healthStatus;
  }
}