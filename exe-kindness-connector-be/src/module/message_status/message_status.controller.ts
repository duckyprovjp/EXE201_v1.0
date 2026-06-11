import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageStatusService } from './message_status.service';
import { CreateMessageStatusDto } from './dto/create-message_status.dto';
import { UpdateMessageStatusDto } from './dto/update-message_status.dto';

@Controller('message-status')
export class MessageStatusController {
  constructor(private readonly messageStatusService: MessageStatusService) {}

  @Post()
  create(@Body() createMessageStatusDto: CreateMessageStatusDto) {
    return this.messageStatusService.create(createMessageStatusDto);
  }

  @Get()
  findAll() {
    return this.messageStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageStatusDto: UpdateMessageStatusDto) {
    return this.messageStatusService.update(+id, updateMessageStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageStatusService.remove(+id);
  }
}
