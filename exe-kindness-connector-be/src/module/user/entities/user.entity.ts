import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/common/enums/role.enum';
import { Status_ACTIVE_LOCKED } from 'src/common/enums/status.enum';
import { Address, AddressSchema } from '../../../common/schemas/address.schema';


@Schema({
    timestamps: true
})
export class User {
  @Prop()
  email!: string;

  @Prop()
  password!: string;

  @Prop()
  fullName!: string;

  @Prop()
  role!: UserRole;

  @Prop()
  status!: Status_ACTIVE_LOCKED;

  @Prop()
  avatar!: string;

  @Prop({
    type: [AddressSchema]
  })
  address!: Address[]
  
  @Prop({ default: 0 })
  points!: number;

  @Prop({ default: false })
  isPremium!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);