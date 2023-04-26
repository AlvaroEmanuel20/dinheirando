import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTokensService } from './serviceTokens.service';

describe('ServiceTokensService', () => {
  let service: ServiceTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceTokensService],
    }).compile();

    service = module.get<ServiceTokensService>(ServiceTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
