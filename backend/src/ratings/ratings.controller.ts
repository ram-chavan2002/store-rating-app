import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  submitRating(@Request() req: any, @Body() body: any) {
    return this.ratingsService.submitRating(req.user.id, body.store_id, body.rating);
  }

  @Get('store/:storeId')
  getStoreRatings(@Param('storeId') storeId: string) {
    return this.ratingsService.getStoreRatings(+storeId);
  }

  @Get('store/:storeId/average')
  getAverage(@Param('storeId') storeId: string) {
    return this.ratingsService.getStoreAverage(+storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/:storeId')
  getMyRating(@Request() req: any, @Param('storeId') storeId: string) {
    return this.ratingsService.getUserRatingForStore(req.user.id, +storeId);
  }
}