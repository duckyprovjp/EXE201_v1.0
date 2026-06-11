import { Module } from '@nestjs/common';
import { MembershipRecordService } from './membership_record.service';
import { MembershipRecordController } from './membership_record.controller';

@Module({
  controllers: [MembershipRecordController],
  providers: [MembershipRecordService],
})
export class MembershipRecordModule {}
