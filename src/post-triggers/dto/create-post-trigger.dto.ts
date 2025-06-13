import { IsString, IsBoolean, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { DmMessageDto } from './dm-message.dto';

export class CreatePostTriggerDto {
  @IsString()
  @IsNotEmpty()
  instagramPostId: string;

  @IsString()
  @IsNotEmpty()
  keyword: string;

  @IsObject()
  @IsNotEmpty()
  dmMessage: DmMessageDto;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}