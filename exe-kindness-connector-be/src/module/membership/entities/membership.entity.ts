import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Membership_Status } from 'src/common/enums/status.enum';

enum Method {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
}

@Schema({
  timestamps: true,
})
export class Membership {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user!: mongoose.Types.ObjectId;

  @Prop()
  startDate!: Date;

  @Prop()
  endDate!: Date;

  @Prop()
  status!: Membership_Status;

  @Prop()
  method!: Method;

  @Prop()
  transactionId!: string;

  @Prop()
  amount!: number;
}
export const MembershipSchema = SchemaFactory.createForClass(Membership);
