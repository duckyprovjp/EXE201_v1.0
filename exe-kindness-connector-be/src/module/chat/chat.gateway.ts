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
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userId?: string },
  ) {
    try {
      client.join(payload.roomId);
      console.log(`Client ${client.id} joined room: ${payload.roomId}`);
      
      if (payload.userId) {
        await this.chatService.markMessagesAsSeen(payload.roomId, payload.userId);
        this.server.to(payload.roomId).emit('messagesSeen', { roomId: payload.roomId, userId: payload.userId });
      }
    } catch (error: any) {
      console.error("Error in joinRoom:", error);
      client.emit('errorMessage', { message: 'Error marking messages as seen: ' + error.message });
    }
  }

  @SubscribeMessage('markAsSeen')
  async handleMarkAsSeen(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userId: string },
  ) {
    try {
      await this.chatService.markMessagesAsSeen(payload.roomId, payload.userId);
      this.server.to(payload.roomId).emit('messagesSeen', { roomId: payload.roomId, userId: payload.userId });
    } catch (error: any) {
      console.error("Error in markAsSeen:", error);
      client.emit('errorMessage', { message: 'Error in markAsSeen: ' + error.message });
    }
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
