import { PartialType } from '@nestjs/mapped-types';
import { CreatePostTriggerDto } from './create-post-trigger.dto';

export class UpdatePostTriggerDto extends PartialType(CreatePostTriggerDto) {}