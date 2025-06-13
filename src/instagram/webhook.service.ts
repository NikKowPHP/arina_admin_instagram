import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PostTriggersService } from '../post-triggers.service';
import { PrismaService } from '../prisma/prisma.service';
import { InstagramWebhookEntry } from './dto/instagram-webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly postTriggersService: PostTriggersService,
    private readonly prisma: PrismaService,
    @InjectQueue('instagram-dm-queue') private dmQueue: Queue,
  ) {}

  async handleWebhookEvent(payload: InstagramWebhookEntry[]) {
    for (const entry of payload) {
      for (const change of entry.changes) {
        if (change.field === 'comments') {
          const { media_id, text, from } = change.value;
          
          // Find triggers matching the comment text
          const triggers = await this.prisma.postTrigger.findMany({
            where: {
              instagramMediaId: media_id,
              keywords: {
                hasSome: text.toLowerCase().split(' '),
              },
            },
          });

          // Dispatch DM jobs for matching triggers
          for (const trigger of triggers) {
            await this.dmQueue.add('send-dm-job', { 
              recipientId: from.id, 
              triggerData: { 
                dmMessage: trigger.message 
              } 
            });
          }
        }
      }
    }
  }
}