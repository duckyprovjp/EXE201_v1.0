import { PartialType } from '@nestjs/mapped-types';
import { CreateBookViolationDto } from './create-book_violation.dto';

export class UpdateBookViolationDto extends PartialType(CreateBookViolationDto) {}
