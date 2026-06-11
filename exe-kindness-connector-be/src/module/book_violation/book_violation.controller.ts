import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookViolationService } from './book_violation.service';
import { CreateBookViolationDto } from './dto/create-book_violation.dto';
import { UpdateBookViolationDto } from './dto/update-book_violation.dto';

@Controller('book-violation')
export class BookViolationController {
  constructor(private readonly bookViolationService: BookViolationService) {}

  @Post()
  create(@Body() createBookViolationDto: CreateBookViolationDto) {
    return this.bookViolationService.create(createBookViolationDto);
  }

  @Get()
  findAll() {
    return this.bookViolationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookViolationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookViolationDto: UpdateBookViolationDto,
  ) {
    return this.bookViolationService.update(id, updateBookViolationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookViolationService.remove(id);
  }
}
