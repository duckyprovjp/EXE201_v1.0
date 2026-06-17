import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { getCoordinatesFromDistrict } from 'src/common/constants/district-coordinates';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(12);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<any> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: 'Delete user successfully' };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async updateProfile(userId: string, data: any): Promise<User> {
    const updateData: any = {};
    if (data.fullName) updateData.fullName = data.fullName;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.address) {
      updateData.address = [data.address]; // Array of Address
      const coords = getCoordinatesFromDistrict(data.address.district);
      if (coords) {
        updateData.geo = { type: 'Point', coordinates: coords };
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }
    return updatedUser;
  }

  async buyMembership(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (user.points < 2000) {
      throw new ConflictException('Not enough points to buy membership');
    }

    user.points -= 2000;
    user.isPremium = true;
    return user.save();
  }

  async addExchangePoints(ownerId: string, requesterId: string): Promise<void> {
    // Owner gets 50 points, Requester gets 25 points (2:1 ratio)
    await this.userModel
      .findByIdAndUpdate(ownerId, { $inc: { points: 50 } })
      .exec();
    await this.userModel
      .findByIdAndUpdate(requesterId, { $inc: { points: 25 } })
      .exec();
  }

  async addReputationScore(userId: string, ratingScore: number): Promise<void> {
    // reputationScore increases by the rating given
    await this.userModel
      .findByIdAndUpdate(userId, { $inc: { reputationScore: ratingScore } })
      .exec();
  }
}
