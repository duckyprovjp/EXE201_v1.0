import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRecordController } from './exchange_record.controller';
import { ExchangeRecordService } from './exchange_record.service';

describe('ExchangeRecordController', () => {
  let controller: ExchangeRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeRecordController],
      providers: [ExchangeRecordService],
    }).compile();

    controller = module.get<ExchangeRecordController>(ExchangeRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
