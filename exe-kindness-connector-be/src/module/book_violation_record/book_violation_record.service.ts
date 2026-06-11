import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBookViolationRecordDto } from './dto/create-book_violation_record.dto';
import { UpdateBookViolationRecordDto } from './dto/update-book_violation_record.dto';
import { BookViolationRecord } from './entities/book_violation_record.entity';

@Injectable()
export class BookViolationRecordService {
  constructor(
    @InjectModel(BookViolationRecord.name)
    private readonly bookViolationRecordModel: Model<BookViolationRecord>,
  ) {}

  async create(createBookViolationRecordDto: CreateBookViolationRecordDto) {
    return await this.bookViolationRecordModel.create(
      createBookViolationRecordDto,
    );
  }

  async findAll() {
    return await this.bookViolationRecordModel.find().populate('bookViolation');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book violation record id');
    }

    const record = await this.bookViolationRecordModel
      .findById(id)
      .populate('bookViolation');

    if (!record) {
      throw new NotFoundException('Book violation record not found');
    }

    return record;
  }

  async update(
    id: string,
    updateBookViolationRecordDto: UpdateBookViolationRecordDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book violation record id');
    }

    const updatedRecord = await this.bookViolationRecordModel.findByIdAndUpdate(
      id,
      updateBookViolationRecordDto,
      { new: true },
    );

    if (!updatedRecord) {
      throw new NotFoundException('Book violation record not found');
    }

    return updatedRecord;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book violation record id');
    }

    const deletedRecord =
      await this.bookViolationRecordModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      throw new NotFoundException('Book violation record not found');
    }

    return {
      message: 'Delete book violation record successfully',
    };
  }
}
