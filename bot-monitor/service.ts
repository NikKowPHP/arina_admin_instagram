import { BotHealthStatus, ActivityEvent, RateLimitConfig } from './types'

const HEALTH_CHECK_INTERVAL = 30000;
const MAX_CONSECUTIVE_FAILURES = 3;
const STORAGE_LIMIT_MB = 1024; // 1GB limit
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxEvents: 1000,
  timeWindow: 60 * 60 * 1000 // 1 hour
};

export class BotMonitor {
  public healthStatus: BotHealthStatus;
  private activityLog: ActivityEvent[] = [];
  private consecutiveFailures = 0;
  private rateLimitConfig: RateLimitConfig;
  private eventCount = 0;
  private lastReset = Date.now();
  public storageCheckInterval: number | null = null;
  private authBreachCount = 0;

  constructor(private botEndpoint: string, private mediaCachePath: string, rateLimit?: RateLimitConfig) {
    this.healthStatus = {
      lastPing: new Date(),
      isHealthy: true,
      errorCount: 0,
      storageUsage: 0,
      authBreaches: 0
    };
    this.rateLimitConfig = rateLimit || DEFAULT_RATE_LIMIT;
  }

  start(): void {
    console.log('Bot monitoring service started');
    setInterval(() => this.checkHealth(), HEALTH_CHECK_INTERVAL);
    this.storageCheckInterval = setInterval(() => this.checkStorage(), 60 * 60 * 1000) as unknown as number; // Check every hour
  }

  stop(): void {
    if (this.storageCheckInterval) {
      clearInterval(this.storageCheckInterval);
    }
  }

  private async checkHealth(): Promise<void> {
    try {
      const response = await fetch(this.botEndpoint + '/healthcheck');
      if (!response.ok) throw new Error('Health check failed');

      this.consecutiveFailures = 0;
      this.healthStatus = {
        ...this.healthStatus,
        lastPing: new Date(),
        isHealthy: true
      };
    } catch (error) {
      this.consecutiveFailures++;
      this.healthStatus = {
        ...this.healthStatus,
        lastPing: new Date(),
        isHealthy: false,
        errorCount: this.healthStatus.errorCount + 1
      };

      this.trackError(error as Error);

      if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        this.handleCriticalFailure();
      }
    }
  }

  private async checkStorage(): Promise<void> {
    try {
      // Simplified storage check - just set a fixed value for demonstration
      // In a real implementation, this would check the actual storage usage
      const usageMB = Math.random() * STORAGE_LIMIT_MB; // Random value between 0 and STORAGE_LIMIT_MB

      this.healthStatus = {
        ...this.healthStatus,
        storageUsage: usageMB
      };

      if (usageMB >= STORAGE_LIMIT_MB * 0.8) { // 80% threshold
        this.trackActivity({
          type: 'storage',
          details: `Storage limit approaching: ${usageMB.toFixed(2)}MB of ${STORAGE_LIMIT_MB}MB`,
          metadata: { storagePath: this.mediaCachePath }
        });

        if (usageMB >= STORAGE_LIMIT_MB) {
          this.handleStorageLimitReached();
        }
      }
    } catch (error) {
      this.trackError(error as Error);
    }
  }

  private handleCriticalFailure(): void {
    this.trackActivity({
      type: 'error',
      details: 'Critical failure threshold reached. Initiating recovery.'
    });

    // Implement actual recovery procedures
    console.error('Critical bot failure detected. Attempting recovery...');

    // 1. Restart bot service
    console.log('Restarting bot service...');
    // Add actual service restart logic here

    // 2. Clear error state after recovery attempt
    this.consecutiveFailures = 0;
    this.healthStatus = {
      ...this.healthStatus,
      isHealthy: true,
      errorCount: 0
    };
  }

  private handleStorageLimitReached(): void {
    this.trackActivity({
      type: 'error',
      details: 'Storage limit reached. Cleanup needed.'
    });

    console.error('Storage limit reached. Initiating cleanup...');
    // Add cleanup logic here, such as deleting old files
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

    // Special handling for auth breach events
    if (event.type === 'auth' && event.details.includes('unauthorized')) {
      this.authBreachCount++;
      this.healthStatus = {
        ...this.healthStatus,
        authBreaches: this.authBreachCount
      };

      if (this.authBreachCount >= 5) { // Alert after 5 breaches
        this.trackActivity({
          type: 'error',
          details: 'Multiple unauthorized access attempts detected. Security review needed.'
        });
      }
    }
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

  trackAuthEvent(userId: string, eventType: string): void {
    this.trackActivity({
      type: 'auth',
      details: `${eventType} for user ${userId}`,
      metadata: { userId }
    });

    // Check for unauthorized access
    if (eventType.includes('unauthorized')) {
      this.authBreachCount++;
      this.healthStatus = {
        ...this.healthStatus,
        authBreaches: this.authBreachCount
      };

      if (this.authBreachCount >= 5) { // Alert after 5 breaches
        this.trackActivity({
          type: 'error',
          details: 'Multiple unauthorized access attempts detected. Security review needed.'
        });
      }
    }
  }

  getRecentActivity(count = 10): ActivityEvent[] {
    return this.activityLog.slice(-count);
  }

  getCurrentHealth(): BotHealthStatus {
    return this.healthStatus;
  }
}