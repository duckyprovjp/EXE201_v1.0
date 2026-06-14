import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Exchange } from './entities/exchange.entity';
import { Exchange_Status } from '../../common/enums/status.enum';
import { ChatService } from '../chat/chat.service';
import { ChatGateway } from '../chat/chat.gateway';

import { User } from '../user/entities/user.entity';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectModel(Exchange.name) private exchangeModel: Model<Exchange>,
    @InjectModel(User.name) private userModel: Model<User>,
    private chatService: ChatService,
    private chatGateway: ChatGateway,
  ) { }

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

    const exchange = await this.exchangeModel.create({
      requester: requesterId,
      book: bookId,
      owner: ownerId,
    });

    const populated = await exchange.populate([{ path: 'requester' }, { path: 'book' }]);

    const chatRoom = await this.chatService.getOrCreateRoom([requesterId, ownerId]);
    await this.chatService.updateActiveExchange(chatRoom._id.toString(), exchange._id.toString());

    const requesterName = (populated.requester as any).fullName || 'Một người dùng';
    const bookTitle = (populated.book as any).title || 'sách';
    const msgContent = `${requesterName} vừa yêu cầu trao đổi cuốn sách ${bookTitle}`;

    const sysMsg = await this.chatService.saveSystemMessage(chatRoom._id.toString(), msgContent);
    this.chatGateway.server.to(chatRoom._id.toString()).emit('newMessage', sysMsg);

    exchange.chatRoomId = chatRoom._id as any;
    await exchange.save();

    return exchange;
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

    if (exchange.owner.toString() !== ownerId && (status === Exchange_Status.ACCEPTED || status === Exchange_Status.REJECTED)) {
      throw new BadRequestException('Only the book owner can accept or reject');
    }

    exchange.status = status;
    return exchange.save();
  }

  async cancelExchange(exchangeId: string, userId: string) {
    const exchange = await this.exchangeModel.findById(exchangeId);
    if (!exchange) throw new NotFoundException('Exchange not found');

    if (exchange.owner.toString() !== userId && exchange.requester.toString() !== userId) {
      throw new BadRequestException('You are not part of this exchange');
    }

    exchange.status = Exchange_Status.CANCELED;
    await exchange.save();

    if (exchange.chatRoomId) {
      const populated = await exchange.populate('book');
      const bookTitle = (populated.book as any).title || 'sách';
      const msgContent = `Giao dịch đổi sách ${bookTitle} đã bị hủy`;

      const sysMsg = await this.chatService.saveSystemMessage(exchange.chatRoomId.toString(), msgContent);
      this.chatGateway.server.to(exchange.chatRoomId.toString()).emit('newMessage', sysMsg);

      this.chatGateway.server.to(exchange.chatRoomId.toString()).emit('exchange_canceled', {
        exchangeId: exchange._id,
        message: 'Giao dịch đã hủy'
      });
    }

    return exchange;
  }

  async completeExchange(exchangeId: string, userId: string) {
    const exchange = await this.exchangeModel.findById(exchangeId);
    if (!exchange) throw new NotFoundException('Exchange not found');

    // Only owner can complete? Or both? Let's say either can complete, or maybe owner only.
    // The requirement says "nếu hoàn tất giao dịch thì sẽ cộng điểm...". We will allow either party to complete, or just owner. Let's allow either.
    if (exchange.owner.toString() !== userId && exchange.requester.toString() !== userId) {
      throw new BadRequestException('You are not part of this exchange');
    }
    if (exchange.status !== Exchange_Status.ACCEPTED) {
      throw new BadRequestException('Exchange must be ACCEPTED before it can be completed');
    }

    exchange.status = Exchange_Status.COMPLETED;
    await exchange.save();

    // Add points: Owner gets 50, Requester gets 25
    await this.userModel.findByIdAndUpdate(exchange.owner.toString(), { $inc: { points: 50 } }).exec();
    await this.userModel.findByIdAndUpdate(exchange.requester.toString(), { $inc: { points: 25 } }).exec();

    if (exchange.chatRoomId) {
      const msgContent = `Giao dịch thành công!`;
      const sysMsg = await this.chatService.saveSystemMessage(exchange.chatRoomId.toString(), msgContent);
      this.chatGateway.server.to(exchange.chatRoomId.toString()).emit('newMessage', sysMsg);

      this.chatGateway.server.to(exchange.chatRoomId.toString()).emit('exchange_completed', {
        exchangeId: exchange._id,
        message: 'Hoàn tất giao dịch'
      });
    }

    return exchange;
  }
}
