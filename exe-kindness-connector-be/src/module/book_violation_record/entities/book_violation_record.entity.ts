import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

enum Action {
  CREATED = 'CREATED',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

@Schema({
  timestamps: true,
})
export class BookViolationRecord {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookViolation',
  })
  bookViolation!: mongoose.Types.ObjectId;

  @Prop()
  action!: Action;

  @Prop()
  note!: string;
}
export const BookViolationRecordSchema =
  SchemaFactory.createForClass(BookViolationRecord);
