import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message_Status } from '../../../common/enums/status.enum';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true })
  roomId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  senderId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  content!: string;

  @Prop({ default: Message_Status.SENT })
  status!: Message_Status;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
