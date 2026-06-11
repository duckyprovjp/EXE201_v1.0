import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookCategoryService } from './book-category.service';
import { BookCategoryController } from './book-category.controller';
import {
  BookCategory,
  BookCategorySchema,
} from './entities/book-category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BookCategory.name,
        schema: BookCategorySchema,
      },
    ]),
  ],
  controllers: [BookCategoryController],
  providers: [BookCategoryService],
})
export class BookCategoryModule {}
