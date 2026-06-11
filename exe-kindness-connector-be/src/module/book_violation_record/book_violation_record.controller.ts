import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookViolationRecordService } from './book_violation_record.service';
import { CreateBookViolationRecordDto } from './dto/create-book_violation_record.dto';
import { UpdateBookViolationRecordDto } from './dto/update-book_violation_record.dto';

@Controller('book-violation-record')
export class BookViolationRecordController {
  constructor(
    private readonly bookViolationRecordService: BookViolationRecordService,
  ) {}

  @Post()
  create(@Body() createBookViolationRecordDto: CreateBookViolationRecordDto) {
    return this.bookViolationRecordService.create(createBookViolationRecordDto);
  }

  @Get()
  findAll() {
    return this.bookViolationRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookViolationRecordService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookViolationRecordDto: UpdateBookViolationRecordDto,
  ) {
    return this.bookViolationRecordService.update(
      id,
      updateBookViolationRecordDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookViolationRecordService.remove(id);
  }
}
