import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PostTriggersModule } from '../post-triggers/post-triggers.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PostTriggersModule, PrismaModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class InstagramModule {}