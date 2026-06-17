import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  reviewerId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  reviewedUserId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exchange',
    required: true,
  })
  exchangeId!: mongoose.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  ratingScore!: number;

  @Prop({ required: true })
  comment!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
