import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Condition } from 'src/common/enums/condition.enum';
import { Book_Status } from 'src/common/enums/status.enum';
import { Address, AddressSchema } from 'src/common/schemas/address.schema';

@Schema({
  timestamps: true,
})
export class Book {
  @Prop()
  title!: string;

  @Prop()
  author!: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BookCategory',
  })
  categories!: mongoose.Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BookCategory',
  })
  advancedCategories!: mongoose.Types.ObjectId[];

  @Prop()
  description!: string;

  @Prop()
  images!: string[];

  @Prop()
  codition!: Condition;

  @Prop({
    type: AddressSchema,
  })
  location!: Address;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner!: mongoose.Types.ObjectId;

  @Prop()
  status!: Book_Status;

  @Prop()
  viewCount!: number;
}
export const BookSchema = SchemaFactory.createForClass(Book);
