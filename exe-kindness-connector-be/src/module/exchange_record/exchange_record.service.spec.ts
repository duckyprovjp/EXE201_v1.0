import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRecordService } from './exchange_record.service';

describe('ExchangeRecordService', () => {
  let service: ExchangeRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRecordService],
    }).compile();

    service = module.get<ExchangeRecordService>(ExchangeRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
