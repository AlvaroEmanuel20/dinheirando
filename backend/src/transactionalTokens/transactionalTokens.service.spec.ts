import { Test, TestingModule } from '@nestjs/testing';
import { TransactionalTokensService } from './transactionalTokens.service';

describe('TransactionalTokensService', () => {
  let service: TransactionalTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionalTokensService],
    }).compile();

    service = module.get<TransactionalTokensService>(
      TransactionalTokensService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
