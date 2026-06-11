import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeRecordService } from './exchange_record.service';
import { ExchangeRecordController } from './exchange_record.controller';
import {
  ExchangeRecord,
  ExchangeRecordSchema,
} from './entities/exchange_record.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExchangeRecord.name,
        schema: ExchangeRecordSchema,
      },
    ]),
  ],
  controllers: [ExchangeRecordController],
  providers: [ExchangeRecordService],
})
export class ExchangeRecordModule {}
