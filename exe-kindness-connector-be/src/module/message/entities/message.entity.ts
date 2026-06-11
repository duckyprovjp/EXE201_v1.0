import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MessageType } from 'src/common/enums/type.enum';

@Schema()
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  })
  conversation!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  sender!: mongoose.Types.ObjectId;

  @Prop()
  content!: string;

  @Prop()
  type!: MessageType;

  @Prop()
  sentAt!: Date;

  @Prop()
  isDelete!: boolean;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
