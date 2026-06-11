import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoryService {
  constructor(
    @InjectModel(BookCategory.name)
    private readonly bookCategoryModel: Model<BookCategory>,
  ) {}

  async create(createBookCategoryDto: CreateBookCategoryDto) {
    return await this.bookCategoryModel.create(createBookCategoryDto);
  }

  async findAll() {
    return await this.bookCategoryModel.find();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book category id');
    }

    const category = await this.bookCategoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Book category not found');
    }

    return category;
  }

  async update(id: string, updateBookCategoryDto: UpdateBookCategoryDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book category id');
    }

    const updatedCategory = await this.bookCategoryModel.findByIdAndUpdate(
      id,
      updateBookCategoryDto,
      { new: true },
    );

    if (!updatedCategory) {
      throw new NotFoundException('Book category not found');
    }

    return updatedCategory;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid book category id');
    }

    const deletedCategory = await this.bookCategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      throw new NotFoundException('Book category not found');
    }

    return {
      message: 'Delete book category successfully',
    };
  }
}
