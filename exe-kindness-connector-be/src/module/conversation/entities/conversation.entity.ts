import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Conversation {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  })
  members!: mongoose.Types.ObjectId[];

  @Prop()
  lastMessage!: string;

  @Prop()
  lastSentAt!: string;
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
