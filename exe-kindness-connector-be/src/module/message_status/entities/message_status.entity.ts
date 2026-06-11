import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message_Status } from 'src/common/enums/status.enum';

@Schema({
  timestamps: {
    updatedAt: true,
    createdAt: false,
  },
})
export class MessageStatus {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  })
  message!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user!: mongoose.Types.ObjectId;

  @Prop()
  status!: Message_Status;
}
export const MessageStatusSchema = SchemaFactory.createForClass(MessageStatus)
