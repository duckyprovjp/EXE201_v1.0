import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExchangeRequestService } from './exchange_request.service';
import { CreateExchangeRequestDto } from './dto/create-exchange_request.dto';
import { UpdateExchangeRequestDto } from './dto/update-exchange_request.dto';

@Controller('exchange-request')
export class ExchangeRequestController {
  constructor(
    private readonly exchangeRequestService: ExchangeRequestService,
  ) {}

  @Post()
  create(@Body() createExchangeRequestDto: CreateExchangeRequestDto) {
    return this.exchangeRequestService.create(createExchangeRequestDto);
  }

  @Get()
  findAll() {
    return this.exchangeRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeRequestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExchangeRequestDto: UpdateExchangeRequestDto,
  ) {
    return this.exchangeRequestService.update(+id, updateExchangeRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exchangeRequestService.remove(+id);
  }
}
