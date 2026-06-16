import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

enum Action {
  CREATED = 'CREATED',
  RENEWED = 'RENEWED',
  CANCELED = 'CANCELED',
}

@Schema({
  timestamps: true,
})
export class MembershipRecord {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
  })
  membership!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user!: mongoose.Types.ObjectId;

  @Prop()
  action!: Action;
}
export const MembershipRecordSchema =
  SchemaFactory.createForClass(MembershipRecord);
