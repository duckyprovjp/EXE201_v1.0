import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class Address {
  @Prop()
  city!: string;

  @Prop()
  district!: string;
}
export const AddressSchema = SchemaFactory.createForClass(Address);
