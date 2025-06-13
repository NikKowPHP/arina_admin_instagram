import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PostTriggersModule } from '../post-triggers/post-triggers.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiService } from './api.service';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [PostTriggersModule, PrismaModule, HttpModule, QueuesModule],
  controllers: [WebhookController],
  providers: [WebhookService, ApiService],
})
export class InstagramModule {}