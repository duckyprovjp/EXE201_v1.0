import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    return await this.conversationModel.create(createConversationDto);
  }

  async findAll() {
    return await this.conversationModel.find().populate('members');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid conversation id');
    }

    const conversation = await this.conversationModel
      .findById(id)
      .populate('members');

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async update(id: string, updateConversationDto: UpdateConversationDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid conversation id');
    }

    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      updateConversationDto,
      { new: true },
    );

    if (!updatedConversation) {
      throw new NotFoundException('Conversation not found');
    }

    return updatedConversation;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid conversation id');
    }

    const deletedConversation =
      await this.conversationModel.findByIdAndDelete(id);

    if (!deletedConversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      message: 'Delete conversation successfully',
    };
  }
}
