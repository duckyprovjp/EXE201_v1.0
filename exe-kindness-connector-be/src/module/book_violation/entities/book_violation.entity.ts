import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BookViolation_Status } from 'src/common/enums/status.enum';

@Schema({
  timestamps: true,
})
export class BookViolation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  reportedUser!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  })
  reportedBook!: mongoose.Types.ObjectId;

  @Prop()
  reason!: string;

  @Prop()
  evidenceImages!: string[];

  @Prop()
  status!: BookViolation_Status;
}
export const BookViolationSchema = SchemaFactory.createForClass(BookViolation)