import { Controller, Get, Post, Query, Req, Body, HttpCode, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    rawBody?: Buffer;
  }
}
import { WebhookService } from './webhook.service';
import * as crypto from 'crypto';

@Controller('webhook/instagram')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return challenge;
    } else {
      throw new ForbiddenException();
    }
  }

  @Post()
  @HttpCode(200)
  async handleEvent(@Req() req: Request, @Body() payload: any) {
    const signature = req.headers['x-hub-signature-256'];
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (!appSecret) {
      throw new ForbiddenException('Missing Facebook app secret');
    }
    if (!req.rawBody) {
      throw new ForbiddenException('Missing request body');
    }
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(req.rawBody)
      .digest('hex');

    if (signature !== `sha256=${expectedSignature}`) {
      throw new ForbiddenException('Invalid signature');
    }

    await this.webhookService.handleWebhookEvent(payload);
    return 'EVENT_RECEIVED';
  }
}