import { Test, TestingModule } from '@nestjs/testing';
import { BookViolationRecordController } from './book_violation_record.controller';
import { BookViolationRecordService } from './book_violation_record.service';

describe('BookViolationRecordController', () => {
  let controller: BookViolationRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookViolationRecordController],
      providers: [BookViolationRecordService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<BookViolationRecordController>(
      BookViolationRecordController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
