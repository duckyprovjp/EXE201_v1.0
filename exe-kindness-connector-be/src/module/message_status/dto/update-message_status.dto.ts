import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageStatusDto } from './create-message_status.dto';

export class UpdateMessageStatusDto extends PartialType(CreateMessageStatusDto) {}
