import { Injectable } from '@nestjs/common';
import { CreateExchangeRequestDto } from './dto/create-exchange_request.dto';
import { UpdateExchangeRequestDto } from './dto/update-exchange_request.dto';

@Injectable()
export class ExchangeRequestService {
  create(createExchangeRequestDto: CreateExchangeRequestDto) {
    return 'This action adds a new exchangeRequest';
  }

  findAll() {
    return `This action returns all exchangeRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exchangeRequest`;
  }

  update(id: number, updateExchangeRequestDto: UpdateExchangeRequestDto) {
    return `This action updates a #${id} exchangeRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} exchangeRequest`;
  }
}
