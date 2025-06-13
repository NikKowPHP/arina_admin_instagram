import { Module } from '@nestjs/common';
import { PostTriggersService } from './post-triggers.service';
import { PostTriggersController } from './post-triggers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostTriggersController],
  providers: [PostTriggersService],
})
export class PostTriggersModule {}
