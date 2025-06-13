import { Module } from '@nestjs/common';
import { InstagramModule } from './instagram/instagram.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostTriggersModule } from './post-triggers/post-triggers.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    PostTriggersModule,
    AuthModule,
    UsersModule,
    InstagramModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
