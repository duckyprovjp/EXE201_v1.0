import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExchangeRecordService } from './exchange_record.service';
import { CreateExchangeRecordDto } from './dto/create-exchange_record.dto';
import { UpdateExchangeRecordDto } from './dto/update-exchange_record.dto';

@Controller('exchange-record')
export class ExchangeRecordController {
  constructor(private readonly exchangeRecordService: ExchangeRecordService) {}

  @Post()
  create(@Body() createExchangeRecordDto: CreateExchangeRecordDto) {
    return this.exchangeRecordService.create(createExchangeRecordDto);
  }

  @Get()
  findAll() {
    return this.exchangeRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeRecordService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExchangeRecordDto: UpdateExchangeRecordDto,
  ) {
    return this.exchangeRecordService.update(id, updateExchangeRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exchangeRecordService.remove(id);
  }
}
