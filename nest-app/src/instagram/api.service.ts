import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async sendDm(recipientId: string, messagePayload: any) {
    const pageAccessToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
    if (!pageAccessToken) {
      throw new Error('Instagram page access token is not configured');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://graph.facebook.com/v19.0/me/messages?access_token=${pageAccessToken}`,
          messagePayload,
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to send DM: ${error.message}`);
      }
      throw error;
    }
  }
}
