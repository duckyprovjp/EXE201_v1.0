import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

type Rating = {
  requesterRating: number;
  ownerRating: number;
};

type Feedback = {
  requesterFeedback: string;
  ownerFeedback: string;
};

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class ExchangeRecord {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExchangeRequest',
  })
  exchangeRequest!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  })
  book!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  requester!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner!: mongoose.Types.ObjectId;

  @Prop()
  exchangedAt!: Date;

  @Prop({
    type: {
      requesterRating: Number,
      ownerRating: Number,
    },
  })
  rating!: Rating;

  @Prop({
    type: {
      requesterFeedback: String,
      ownerFeedback: String,
    },
  })
  feedback!: Feedback;
}
export const ExchangeRecordSchema =
  SchemaFactory.createForClass(ExchangeRecord);
