import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createRoom(participants: string[], exchangeId: string) {
    return this.chatRoomModel.create({
      participants,
      exchangeId,
    });
  }

  async getRoomsForUser(userId: string) {
    return this.chatRoomModel
      .find({ participants: userId })
      .populate('participants', 'fullName avatar')
      .populate({
        path: 'exchangeId',
        populate: { path: 'book', select: 'title images' }
      })
      .sort({ updatedAt: -1 });
  }

  async getMessagesForRoom(roomId: string) {
    return this.messageModel
      .find({ roomId })
      .populate('senderId', 'fullName avatar')
      .sort({ createdAt: 1 });
  }

  async saveMessage(roomId: string, senderId: string, content: string) {
    return this.messageModel.create({
      roomId,
      senderId,
      content,
    });
  }
}
