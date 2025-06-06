import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class DmMessageDto {
  @IsUrl()
  @IsOptional()
  media_url?: string;

  @IsString()
  @IsOptional()
  media_type?: string;

  @IsString()
  @IsNotEmpty()
  description_text: string;

  @IsString()
  @IsOptional()
  cta_text?: string;

  @IsUrl()
  @IsOptional()
  cta_url?: string;
}