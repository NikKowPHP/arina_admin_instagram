import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { PostTriggersService } from './post-triggers.service';
import { CreatePostTriggerDto } from './post-triggers/dto/create-post-trigger.dto';
import { UpdatePostTriggerDto } from './post-triggers/dto/update-post-trigger.dto';
import { Response } from 'express';

@Controller('post-triggers')
export class PostTriggersController {
  constructor(private readonly postTriggersService: PostTriggersService) {}

  // Admin UI Views
  @Get('/ui/triggers')
  @Render('admin/triggers/index')
  async listTriggersView() {
    const triggers = await this.postTriggersService.findAll();
    return { triggers };
  }

  @Get('/ui/triggers/create')
  @Render('admin/triggers/create')
  createTriggerView() {
    return {};
  }

  @Post('/ui/triggers/create')
  async handleCreateTrigger(@Body() createPostTriggerDto: CreatePostTriggerDto, @Res() res: Response) {
    await this.postTriggersService.create(createPostTriggerDto);
    res.redirect('/post-triggers/ui/triggers');
  }

  @Get('/ui/triggers/:id/edit')
  @Render('admin/triggers/edit')
  async editTriggerView(@Param('id') id: string) {
    const trigger = await this.postTriggersService.findOne(+id);
    return { trigger };
  }

  @Post('/ui/triggers/:id/edit')
  async handleUpdateTrigger(
    @Param('id') id: string,
    @Body() updatePostTriggerDto: UpdatePostTriggerDto,
    @Res() res: Response
  ) {
    await this.postTriggersService.update(+id, updatePostTriggerDto);
    res.redirect('/post-triggers/ui/triggers');
  }

  @Post('/ui/triggers/:id/delete')
  async handleDeleteTrigger(@Param('id') id: string, @Res() res: Response) {
    await this.postTriggersService.remove(+id);
    res.redirect('/post-triggers/ui/triggers');
  }

  // Original API endpoints remain unchanged
  @Post()
  create(@Body() createPostTriggerDto: CreatePostTriggerDto) {
    return this.postTriggersService.create(createPostTriggerDto);
  }

  @Get()
  findAll() {
    return this.postTriggersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postTriggersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostTriggerDto: UpdatePostTriggerDto) {
    return this.postTriggersService.update(+id, updatePostTriggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTriggersService.remove(+id);
  }
}
