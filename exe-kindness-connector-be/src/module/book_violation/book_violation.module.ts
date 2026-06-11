import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookViolationService } from './book_violation.service';
import { BookViolationController } from './book_violation.controller';
import {
  BookViolation,
  BookViolationSchema,
} from './entities/book_violation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BookViolation.name,
        schema: BookViolationSchema,
      },
    ]),
  ],
  controllers: [BookViolationController],
  providers: [BookViolationService],
})
export class BookViolationModule {}
