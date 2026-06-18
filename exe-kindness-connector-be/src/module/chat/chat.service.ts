import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { Message_Status } from '../../common/enums/status.enum';

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
      participants: { $all: participants, $size: participants.length },
    });

    if (existingRoom) {
      return existingRoom;
    }

    return this.chatRoomModel.create({
      participants,
    });
  }

  async updateActiveExchange(roomId: string, exchangeId: string) {
    return this.chatRoomModel.findByIdAndUpdate(
      roomId,
      { activeExchange: exchangeId },
      { new: true },
    );
  }

  async getRoomsForUser(userId: string) {
    const rooms = await this.chatRoomModel
      .find({ participants: userId })
      .populate('participants', 'fullName avatar')
      .populate({
        path: 'activeExchange',
        select: 'status book owner requester',
        populate: { path: 'book', select: 'title images' },
      })
      .sort({ updatedAt: -1 });

    return rooms.filter(room => {
      if (room.activeExchange) {
        const exchange = room.activeExchange as any;
        return exchange.status !== 'PENDING' && exchange.status !== 'REJECTED';
      }
      return false;
    });
  }

  async getMessagesForRoom(roomId: string) {
    return this.messageModel
      .find({ roomId })
      .populate('senderId', 'fullName avatar')
      .sort({ createdAt: 1 });
  }

  async markMessagesAsSeen(roomId: string, userId: string) {
    await this.messageModel.updateMany(
      {
        roomId: new mongoose.Types.ObjectId(roomId),
        senderId: { $ne: new mongoose.Types.ObjectId(userId) },
        status: { $ne: Message_Status.SEEN },
      },
      { $set: { status: Message_Status.SEEN } },
    );
  }

  async saveMessage(roomId: string, senderId: string, content: string) {
    const room = await this.chatRoomModel
      .findById(roomId)
      .populate('activeExchange');
    if (room && room.activeExchange) {
      const exchangeStatus = (room.activeExchange as any).status;
      if (exchangeStatus === 'CANCELED' || exchangeStatus === 'COMPLETED') {
        throw new Error(
          'Giao dịch đã kết thúc, bạn không thể gửi thêm tin nhắn.',
        );
      }
      if (exchangeStatus === 'PENDING') {
        throw new Error(
          'Giao dịch chưa được chấp nhận, bạn chưa thể gửi tin nhắn.',
        );
      }
      if (exchangeStatus === 'REJECTED') {
        throw new Error(
          'Yêu cầu giao dịch đã bị từ chối.',
        );
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

  async getUnreadRoomsCount(userId: string): Promise<number> {
    const rooms = await this.chatRoomModel
      .find({ participants: userId })
      .populate('activeExchange', 'status');

    const validRoomIds = rooms
      .filter(room => {
        if (room.activeExchange) {
          const exchange = room.activeExchange as any;
          return exchange.status !== 'PENDING' && exchange.status !== 'REJECTED';
        }
        return false;
      })
      .map(r => r._id);

    const unreadRoomIds = await this.messageModel.distinct('roomId', {
      roomId: { $in: validRoomIds },
      senderId: { $ne: new mongoose.Types.ObjectId(userId) },
      status: { $ne: Message_Status.SEEN },
      isSystem: { $ne: true }
    });

    return unreadRoomIds.length;
  }
}
