import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ApiService } from '../instagram/api.service';

@Processor('instagram-dm-queue')
export class InstagramDmProcessor {
  constructor(private readonly apiService: ApiService) {}

  @Process('send-dm-job')
  async handleSendDm(job: Job<{ recipientId: string; triggerData: any }>) {
    const messagePayload = job.data.triggerData.dmMessage;
    await this.apiService.sendDm(job.data.recipientId, messagePayload);
  }
}