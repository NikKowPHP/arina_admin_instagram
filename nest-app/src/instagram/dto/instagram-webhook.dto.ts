import { ApiProperty } from '@nestjs/swagger';

export class InstagramWebhookEntry {
  @ApiProperty()
  id: string;

  @ApiProperty()
  time: number;

  @ApiProperty({ type: () => [InstagramWebhookChange] })
  changes: InstagramWebhookChange[];
}

export class InstagramWebhookChange {
  @ApiProperty()
  field: string;

  @ApiProperty()
  value: InstagramWebhookValue;
}

export class InstagramWebhookValue {
  @ApiProperty()
  media_id: string;

  @ApiProperty()
  comment_id: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  from: {
    id: string;
    username: string;
  };
}