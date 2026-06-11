import { Injectable } from '@nestjs/common';
import { CreateMessageStatusDto } from './dto/create-message_status.dto';
import { UpdateMessageStatusDto } from './dto/update-message_status.dto';

@Injectable()
export class MessageStatusService {
  create(createMessageStatusDto: CreateMessageStatusDto) {
    return 'This action adds a new messageStatus';
  }

  findAll() {
    return `This action returns all messageStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageStatus`;
  }

  update(id: number, updateMessageStatusDto: UpdateMessageStatusDto) {
    return `This action updates a #${id} messageStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageStatus`;
  }
}
