import { Test, TestingModule } from '@nestjs/testing';
import { BookViolationRecordService } from './book_violation_record.service';

describe('BookViolationRecordService', () => {
  let service: BookViolationRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookViolationRecordService],
    }).useMocker(() => ({})).compile();

    service = module.get<BookViolationRecordService>(BookViolationRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
