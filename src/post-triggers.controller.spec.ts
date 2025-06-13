import { Test, TestingModule } from '@nestjs/testing';
import { PostTriggersController } from './post-triggers.controller';

describe('PostTriggersController', () => {
  let controller: PostTriggersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostTriggersController],
    }).compile();

    controller = module.get<PostTriggersController>(PostTriggersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
