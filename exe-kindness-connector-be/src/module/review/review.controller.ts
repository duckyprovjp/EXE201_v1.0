import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@Req() req: any, @Body() body: any) {
    const reviewerId = req.user.userId;
    return this.reviewService.createReview({
      reviewerId,
      ...body,
    });
  }
}
