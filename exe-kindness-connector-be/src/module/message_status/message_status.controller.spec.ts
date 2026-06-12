import { Test, TestingModule } from '@nestjs/testing';
import { MessageStatusController } from './message_status.controller';
import { MessageStatusService } from './message_status.service';

describe('MessageStatusController', () => {
  let controller: MessageStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageStatusController],
      providers: [MessageStatusService],
    }).useMocker(() => ({})).compile();

    controller = module.get<MessageStatusController>(MessageStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
