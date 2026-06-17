import { PartialType } from '@nestjs/mapped-types';
import { CreateExchangeRecordDto } from './create-exchange_record.dto';

export class UpdateExchangeRecordDto extends PartialType(
  CreateExchangeRecordDto,
) {}
