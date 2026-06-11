import { Module } from '@nestjs/common';
import { MessageStatusService } from './message_status.service';
import { MessageStatusController } from './message_status.controller';

@Module({
  controllers: [MessageStatusController],
  providers: [MessageStatusService],
})
export class MessageStatusModule {}
