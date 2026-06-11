import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipRecordDto } from './create-membership_record.dto';

export class UpdateMembershipRecordDto extends PartialType(CreateMembershipRecordDto) {}
