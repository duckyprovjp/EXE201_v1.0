import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/common/enums/role.enum';
import { Status_ACTIVE_LOCKED } from 'src/common/enums/status.enum';
import { Address, AddressSchema } from '../../../common/schemas/address.schema';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  email!: string;

  @Prop()
  password!: string;

  @Prop()
  fullName!: string;

  @Prop({ type: String, enum: UserRole })
  role!: UserRole;

  @Prop({ type: String, enum: Status_ACTIVE_LOCKED })
  status!: Status_ACTIVE_LOCKED;

  @Prop()
  avatar!: string;

  @Prop({
    type: [AddressSchema],
  })
  address!: Address[];

  @Prop({ default: 0 })
  points!: number;

  @Prop({ default: false })
  isPremium!: boolean;

  @Prop({ default: 0 })
  reputationScore!: number;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  })
  geo?: { type: string; coordinates: number[] };
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ geo: '2dsphere' });
