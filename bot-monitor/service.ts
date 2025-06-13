import { BotHealthStatus, ActivityEvent } from './types';

const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const MAX_CONSECUTIVE_FAILURES = 3;

export class BotMonitor {
  private healthStatus: BotHealthStatus;
  private activityLog: ActivityEvent[] = [];
  private consecutiveFailures = 0;

  constructor(private botEndpoint: string) {
    this.healthStatus = {
      lastPing: new Date(),
      isHealthy: true,
      errorCount: 0
    };
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

      this.trackActivity({
        type: 'error',
        details: `Health check failed: ${error.message}`
      });

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

  trackActivity(event: Omit<ActivityEvent, 'timestamp'>): void {
    this.activityLog.push({
      ...event,
      timestamp: new Date()
    });
  }

  getRecentActivity(count = 10): ActivityEvent[] {
    return this.activityLog.slice(-count);
  }

  getCurrentHealth(): BotHealthStatus {
    return this.healthStatus;
  }
}