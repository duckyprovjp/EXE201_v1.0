import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookViolationRecordService } from './book_violation_record.service';
import { BookViolationRecordController } from './book_violation_record.controller';
import {
  BookViolationRecord,
  BookViolationRecordSchema,
} from './entities/book_violation_record.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BookViolationRecord.name,
        schema: BookViolationRecordSchema,
      },
    ]),
  ],
  controllers: [BookViolationRecordController],
  providers: [BookViolationRecordService],
})
export class BookViolationRecordModule {}
