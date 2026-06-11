import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryType } from 'src/common/enums/category.enum';

@Schema({
  timestamps: true,
})
export class BookCategory {
  @Prop()
  name!: string;

  @Prop()
  type!: CategoryType;
}
export const BookCategorySchema = SchemaFactory.createForClass(BookCategory);
