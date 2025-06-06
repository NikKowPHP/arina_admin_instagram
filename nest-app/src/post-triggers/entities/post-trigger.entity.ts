import { DmMessageDto } from '../dto/dm-message.dto';

export class PostTriggerEntity {
  id: number;
  instagramPostId: string;
  keyword: string;
  dmMessage: any; // Use 'any' or a more specific type if you parse the JSON
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}