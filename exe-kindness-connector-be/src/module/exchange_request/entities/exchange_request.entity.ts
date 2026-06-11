import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Exchange_Status } from 'src/common/enums/status.enum';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class ExchangeRequest {
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
  message!: string;

  @Prop()
  status!: Exchange_Status;

  @Prop()
  respondedAt!: Date;

  @Prop()
  completedAt!: Date;
}
export const ExchangeRequestSchema = SchemaFactory.createForClass(ExchangeRequest)