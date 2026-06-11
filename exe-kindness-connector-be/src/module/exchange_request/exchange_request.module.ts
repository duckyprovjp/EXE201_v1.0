import { Module } from '@nestjs/common';
import { ExchangeRequestService } from './exchange_request.service';
import { ExchangeRequestController } from './exchange_request.controller';

@Module({
  controllers: [ExchangeRequestController],
  providers: [ExchangeRequestService],
})
export class ExchangeRequestModule {}
