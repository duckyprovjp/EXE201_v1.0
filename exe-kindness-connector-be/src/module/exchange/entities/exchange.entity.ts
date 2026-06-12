import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Exchange_Status } from '../../../common/enums/status.enum';

@Schema({ timestamps: true })
export class Exchange {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  requester!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true })
  book!: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: Exchange_Status, default: Exchange_Status.PENDING })
  status!: Exchange_Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' })
  chatRoomId?: mongoose.Types.ObjectId;
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
