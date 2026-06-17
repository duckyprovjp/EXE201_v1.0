import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import {
  Status_ACTIVE_LOCKED,
  Book_Status,
} from '../../common/enums/status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userModel.countDocuments();
    const totalBooks = await this.bookModel.countDocuments();
    return {
      totalUsers,
      totalBooks,
    };
  }

  async getAllUsers() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  async getAllBooks() {
    return this.bookModel
      .find()
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 });
  }

  async updateUserStatus(id: string, status: Status_ACTIVE_LOCKED) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateBookStatus(id: string, status: Book_Status) {
    const book = await this.bookModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }
}
