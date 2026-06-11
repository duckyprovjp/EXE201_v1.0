import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  getRooms(@Req() req: any) {
    return this.chatService.getRoomsForUser(req.user.userId);
  }

  @Get('rooms/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.chatService.getMessagesForRoom(id);
  }
}
