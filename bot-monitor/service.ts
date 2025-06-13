import { BotHealthStatus, ActivityEvent } from './types';

export class BotMonitor {
  private healthStatus: BotHealthStatus;
  private activityLog: ActivityEvent[] = [];

  constructor() {
    this.healthStatus = {
      lastPing: new Date(),
      isHealthy: true,
      errorCount: 0
    };
  }

  start(): void {
    console.log('Bot monitoring service started');
    setInterval(() => this.checkHealth(), 30000);
  }

  checkHealth(): BotHealthStatus {
    this.healthStatus.lastPing = new Date();
    // TODO: Implement actual health check logic
    return this.healthStatus;
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
}