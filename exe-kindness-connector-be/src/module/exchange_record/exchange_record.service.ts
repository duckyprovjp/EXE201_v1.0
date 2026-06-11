import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateExchangeRecordDto } from './dto/create-exchange_record.dto';
import { UpdateExchangeRecordDto } from './dto/update-exchange_record.dto';
import { ExchangeRecord } from './entities/exchange_record.entity';

@Injectable()
export class ExchangeRecordService {
  constructor(
    @InjectModel(ExchangeRecord.name)
    private readonly exchangeRecordModel: Model<ExchangeRecord>,
  ) {}

  async create(createExchangeRecordDto: CreateExchangeRecordDto) {
    return await this.exchangeRecordModel.create(createExchangeRecordDto);
  }

  async findAll() {
    return await this.exchangeRecordModel
      .find()
      .populate('exchangeRequest')
      .populate('book')
      .populate('requester')
      .populate('owner');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid exchange record id');
    }

    const record = await this.exchangeRecordModel
      .findById(id)
      .populate('exchangeRequest')
      .populate('book')
      .populate('requester')
      .populate('owner');

    if (!record) {
      throw new NotFoundException('Exchange record not found');
    }

    return record;
  }

  async update(id: string, updateExchangeRecordDto: UpdateExchangeRecordDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid exchange record id');
    }

    const updatedRecord = await this.exchangeRecordModel.findByIdAndUpdate(
      id,
      updateExchangeRecordDto,
      { new: true },
    );

    if (!updatedRecord) {
      throw new NotFoundException('Exchange record not found');
    }

    return updatedRecord;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid exchange record id');
    }

    const deletedRecord = await this.exchangeRecordModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      throw new NotFoundException('Exchange record not found');
    }

    return {
      message: 'Delete exchange record successfully',
    };
  }
}
