import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LocationType } from 'src/common/enums/location-type.enum';

@Schema({
  timestamps: true,
})
export class Location {
  @Prop()
  name!: string;

  @Prop({ type: String, enum: LocationType })
  type!: LocationType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  parent!: mongoose.Types.ObjectId;

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
export const LocationSchema = SchemaFactory.createForClass(Location);
LocationSchema.index({ geo: '2dsphere' });
