import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreatePostTriggerDto } from './post-triggers/dto/create-post-trigger.dto';
import { UpdatePostTriggerDto } from './post-triggers/dto/update-post-trigger.dto';

@Injectable()
export class PostTriggersService {
  constructor(private prisma: PrismaService) {}

  create(createPostTriggerDto: CreatePostTriggerDto) {
    return this.prisma.postTrigger.create({ data: createPostTriggerDto });
  }

  findAll(skip?: number, take?: number) {
    return this.prisma.postTrigger.findMany({ skip, take });
  }

  findOne(id: number) {
    return this.prisma.postTrigger.findUnique({ where: { id } });
  }

  update(id: number, updatePostTriggerDto: UpdatePostTriggerDto) {
    return this.prisma.postTrigger.update({
      where: { id },
      data: updatePostTriggerDto,
    });
  }

  remove(id: number) {
    return this.prisma.postTrigger.delete({ where: { id } });
  }
}
