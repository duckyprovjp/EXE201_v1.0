import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true })
  participants!: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Exchange' })
  activeExchange?: mongoose.Types.ObjectId;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
