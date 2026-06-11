import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private locationModel: Model<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    return await this.locationModel.create(createLocationDto);
  }

  async findAll() {
    return await this.locationModel.find().populate('parent');
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid location id');
    }

    const location = await this.locationModel.findById(id).populate('parent');

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const updatedLocation = await this.locationModel.findByIdAndUpdate(
      id,
      updateLocationDto,
      {
        new: true,
      },
    );

    if (!updatedLocation) {
      throw new NotFoundException('Location not found');
    }

    return updatedLocation;
  }

  async remove(id: string) {
    const deletedLocation = await this.locationModel.findByIdAndDelete(id);

    if (!deletedLocation) {
      throw new NotFoundException('Location not found');
    }

    return {
      message: 'Delete location successfully',
    };
  }
}
