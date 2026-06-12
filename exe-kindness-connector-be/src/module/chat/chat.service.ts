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

  async getOrCreateRoom(participants: string[]) {
    // Find a room that contains EXACTLY these participants.
    // Assuming participants array always has exactly 2 members.
    const existingRoom = await this.chatRoomModel.findOne({
      participants: { $all: participants, $size: participants.length }
    });

    if (existingRoom) {
      return existingRoom;
    }

    return this.chatRoomModel.create({
      participants,
    });
  }

  async updateActiveExchange(roomId: string, exchangeId: string) {
    return this.chatRoomModel.findByIdAndUpdate(roomId, { activeExchange: exchangeId }, { new: true });
  }

  async getRoomsForUser(userId: string) {
    return this.chatRoomModel
      .find({ participants: userId })
      .populate('participants', 'fullName avatar')
      .populate({
        path: 'activeExchange',
        select: 'status book',
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
    const room = await this.chatRoomModel.findById(roomId).populate('activeExchange');
    if (room && room.activeExchange) {
      const exchangeStatus = (room.activeExchange as any).status;
      if (exchangeStatus === 'CANCELED' || exchangeStatus === 'COMPLETED') {
        throw new Error('Giao dịch đã kết thúc, bạn không thể gửi thêm tin nhắn.');
      }
    }

    return this.messageModel.create({
      roomId,
      senderId,
      content,
    });
  }

  async saveSystemMessage(roomId: string, content: string) {
    return this.messageModel.create({
      roomId,
      content,
      isSystem: true,
    });
  }
}
