import { Test, TestingModule } from '@nestjs/testing';
import { BookViolationController } from './book_violation.controller';
import { BookViolationService } from './book_violation.service';

describe('BookViolationController', () => {
  let controller: BookViolationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookViolationController],
      providers: [BookViolationService],
    }).useMocker(() => ({})).compile();

    controller = module.get<BookViolationController>(BookViolationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
