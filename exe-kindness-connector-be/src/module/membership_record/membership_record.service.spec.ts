import { Test, TestingModule } from '@nestjs/testing';
import { MembershipRecordService } from './membership_record.service';

describe('MembershipRecordService', () => {
  let service: MembershipRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipRecordService],
    }).compile();

    service = module.get<MembershipRecordService>(MembershipRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
