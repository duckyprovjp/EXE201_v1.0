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
    type: [String],
  })
  categories!: string[];

  @Prop({
    type: [String],
  })
  advancedCategories!: string[];

  @Prop()
  description!: string;

  @Prop()
  images!: string[];

  @Prop({ type: String, enum: Condition })
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

  @Prop({ type: String, enum: Book_Status })
  status!: Book_Status;

  @Prop()
  viewCount!: number;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  })
  geo?: { type: string; coordinates: number[] };
}
export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ geo: '2dsphere' });
