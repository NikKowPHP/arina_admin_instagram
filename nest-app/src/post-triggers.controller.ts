import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe } from '@nestjs/common';
import { PostTriggersService } from './post-triggers.service';
import { CreatePostTriggerDto } from './post-triggers/dto/create-post-trigger.dto';
import { UpdatePostTriggerDto } from './post-triggers/dto/update-post-trigger.dto';

@Controller('post-triggers')
export class PostTriggersController {
  constructor(private readonly postTriggersService: PostTriggersService) {}

  @Post()
  create(@Body(ValidationPipe) createPostTriggerDto: CreatePostTriggerDto) {
    return this.postTriggersService.create(createPostTriggerDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.postTriggersService.findAll(+skip, +take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postTriggersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updatePostTriggerDto: UpdatePostTriggerDto) {
    return this.postTriggersService.update(+id, updatePostTriggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTriggersService.remove(+id);
  }
}
