import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBookViolationDto } from './dto/create-book_violation.dto';
import { UpdateBookViolationDto } from './dto/update-book_violation.dto';
import { BookViolation } from './entities/book_violation.entity';

@Injectable()
export class BookViolationService {
  constructor(
    @InjectModel(BookViolation.name)
    private readonly bookViolationModel: Model<BookViolation>,
  ) {}

  async create(createBookViolationDto: CreateBookViolationDto) {
    return await this.bookViolationModel.create(createBookViolationDto);
  }

  async findAll() {
    return await this.bookViolationModel
      .find()
      .populate('reportedUser')
      .populate('reportedBook');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book violation id');
    }

    const violation = await this.bookViolationModel
      .findById(id)
      .populate('reportedUser')
      .populate('reportedBook');

    if (!violation) {
      throw new NotFoundException('Book violation not found');
    }

    return violation;
  }

  async update(id: string, updateBookViolationDto: UpdateBookViolationDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book violation id');
    }

    const updatedViolation = await this.bookViolationModel.findByIdAndUpdate(
      id,
      updateBookViolationDto,
      { new: true },
    );

    if (!updatedViolation) {
      throw new NotFoundException('Book violation not found');
    }

    return updatedViolation;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book violation id');
    }

    const deletedViolation =
      await this.bookViolationModel.findByIdAndDelete(id);

    if (!deletedViolation) {
      throw new NotFoundException('Book violation not found');
    }

    return {
      message: 'Delete book violation successfully',
    };
  }
}
