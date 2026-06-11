import { PartialType } from '@nestjs/mapped-types';
import { CreateBookViolationRecordDto } from './create-book_violation_record.dto';

export class UpdateBookViolationRecordDto extends PartialType(CreateBookViolationRecordDto) {}
