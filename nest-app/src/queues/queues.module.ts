import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { InstagramDmProcessor } from './instagram-dm.processor';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'instagram-dm-queue',
    }),
  ],
  providers: [InstagramDmProcessor],
  exports: [BullModule],
})
export class QueuesModule {}