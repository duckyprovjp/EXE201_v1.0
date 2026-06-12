import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRequestService } from './exchange_request.service';

describe('ExchangeRequestService', () => {
  let service: ExchangeRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRequestService],
    }).useMocker(() => ({})).compile();

    service = module.get<ExchangeRequestService>(ExchangeRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
