import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    // Usually you would extract JWT and map userId to socketId
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    client.join(payload.roomId);
    console.log(`Client ${client.id} joined room: ${payload.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; senderId: string; content: string },
  ) {
    try {
      // Save message to DB
      const message = await this.chatService.saveMessage(
        payload.roomId,
        payload.senderId,
        payload.content,
      );

      // Broadcast to everyone in the room (including sender to confirm)
      this.server.to(payload.roomId).emit('newMessage', message);
    } catch (error: any) {
      client.emit('errorMessage', { message: error.message || 'Error sending message' });
    }
  }
}
