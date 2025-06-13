import { Test, TestingModule } from '@nestjs/testing';
import { PostTriggersService } from './post-triggers.service';

describe('PostTriggersService', () => {
  let service: PostTriggersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostTriggersService],
    }).compile();

    service = module.get<PostTriggersService>(PostTriggersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
