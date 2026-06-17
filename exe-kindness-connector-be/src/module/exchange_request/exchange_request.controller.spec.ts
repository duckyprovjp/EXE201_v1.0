import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRequestController } from './exchange_request.controller';
import { ExchangeRequestService } from './exchange_request.service';

describe('ExchangeRequestController', () => {
  let controller: ExchangeRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeRequestController],
      providers: [ExchangeRequestService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<ExchangeRequestController>(
      ExchangeRequestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
