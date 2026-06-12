import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './entities/review.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly userService: UserService
  ) {}

  async createReview(data: any): Promise<Review> {
    const { reviewerId, reviewedUserId, exchangeId, ratingScore, comment } = data;
    
    // Check if review already exists for this exchange and reviewer
    const existing = await this.reviewModel.findOne({ reviewerId, exchangeId });
    if (existing) {
      throw new BadRequestException('You have already reviewed this exchange');
    }

    const review = new this.reviewModel({
      reviewerId,
      reviewedUserId,
      exchangeId,
      ratingScore,
      comment
    });
    
    await review.save();

    // Update reputation score of the reviewed user
    await this.userService.addReputationScore(reviewedUserId, ratingScore);

    return review;
  }
}
