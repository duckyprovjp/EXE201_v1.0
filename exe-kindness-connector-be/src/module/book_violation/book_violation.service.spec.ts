import { Test, TestingModule } from '@nestjs/testing';
import { BookViolationService } from './book_violation.service';

describe('BookViolationService', () => {
  let service: BookViolationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookViolationService],
    }).useMocker(() => ({})).compile();

    service = module.get<BookViolationService>(BookViolationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
