import { Test, TestingModule } from '@nestjs/testing';
import { MembershipRecordController } from './membership_record.controller';
import { MembershipRecordService } from './membership_record.service';

describe('MembershipRecordController', () => {
  let controller: MembershipRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipRecordController],
      providers: [MembershipRecordService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<MembershipRecordController>(
      MembershipRecordController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
