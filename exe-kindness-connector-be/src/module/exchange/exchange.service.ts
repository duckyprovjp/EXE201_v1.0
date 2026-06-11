import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Exchange } from './entities/exchange.entity';
import { Exchange_Status } from '../../common/enums/status.enum';
import { ChatService } from '../chat/chat.service';

import { User } from '../user/entities/user.entity';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(Exchange.name) private exchangeModel: Model<Exchange>,
    @InjectModel(User.name) private userModel: Model<User>,
    private chatService: ChatService,
  ) {}

  async create(requesterId: string, bookId: string, ownerId: string) {
    if (requesterId === ownerId) {
      throw new BadRequestException('You cannot request your own book');
    }

    // Check if there is already a pending request
    const existing = await this.exchangeModel.findOne({
      requester: requesterId,
      book: bookId,
      status: Exchange_Status.PENDING,
    });

    if (existing) {
      throw new BadRequestException('You already have a pending request for this book');
    }

    return this.exchangeModel.create({
      requester: requesterId,
      book: bookId,
      owner: ownerId,
    });
  }

  async findAllForUser(userId: string) {
    // Get requests where user is either the owner (incoming) or requester (outgoing)
    return this.exchangeModel
      .find({
        $or: [{ owner: userId }, { requester: userId }],
      })
      .populate('book')
      .populate('requester', 'fullName email avatar')
      .populate('owner', 'fullName email avatar')
      .sort({ createdAt: -1 });
  }

  async findAllForBook(bookId: string, ownerId: string) {
    return this.exchangeModel
      .find({ book: bookId, owner: ownerId })
      .populate('requester', 'fullName email avatar')
      .sort({ createdAt: -1 });
  }

  async updateStatus(exchangeId: string, ownerId: string, status: Exchange_Status) {
    const exchange = await this.exchangeModel.findById(exchangeId);
    if (!exchange) {
      throw new NotFoundException('Exchange request not found');
    }

    // Only owner can ACCEPT or REJECT
    if (exchange.owner.toString() !== ownerId && (status === Exchange_Status.ACCEPTED || status === Exchange_Status.REJECTED)) {
      throw new BadRequestException('Only the book owner can accept or reject');
    }

    exchange.status = status;

    if (status === Exchange_Status.ACCEPTED) {
      // Create a chat room for them
      const chatRoom = await this.chatService.createRoom([exchange.owner.toString(), exchange.requester.toString()], exchangeId);
      exchange.chatRoomId = chatRoom._id as any;

      // Add points
      await this.userModel.findByIdAndUpdate(exchange.owner.toString(), { $inc: { points: 50 } });
      await this.userModel.findByIdAndUpdate(exchange.requester.toString(), { $inc: { points: 25 } });
    }

    return exchange.save();
  }
}
