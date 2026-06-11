import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = await this.bookModel.create(createBookDto as any);
    if (createBookDto.owner) {
      await this.userModel.findByIdAndUpdate(createBookDto.owner, { $inc: { points: 10 } });
    }
    return book;
  }

  async findAll(query?: any) {
    const filter: any = {};
    if (query?.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { author: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query?.category) {
      filter.categories = query.category;
    }

    return await this.bookModel
      .find(filter)
      .populate('categories')
      .populate('advancedCategories')
      .populate('owner');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const book = await this.bookModel
      .findById(id)
      .populate('categories')
      .populate('advancedCategories')
      .populate('owner');

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const updatedBook = await this.bookModel.findByIdAndUpdate(
      id,
      updateBookDto,
      {
        new: true,
      },
    );

    if (!updatedBook) {
      throw new NotFoundException('Book not found');
    }

    return updatedBook;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book id');
    }

    const deletedBook = await this.bookModel.findByIdAndDelete(id);

    if (!deletedBook) {
      throw new NotFoundException('Book not found');
    }

    return {
      message: 'Delete book successfully',
    };
  }
}
