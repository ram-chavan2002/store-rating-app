import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';

@Injectable()
export class RatingsService {
  constructor(@InjectRepository(Rating) private ratingsRepo: Repository<Rating>) {}

  async submitRating(userId: number, storeId: number, rating: number) {
    const existing = await this.ratingsRepo.findOne({
      where: { user_id: userId, store_id: storeId }
    });
    if (existing) {
      await this.ratingsRepo.update(existing.id, { rating });
      return { message: 'Rating updated' };
    }
    const newRating = this.ratingsRepo.create({ user_id: userId, store_id: storeId, rating });
    return this.ratingsRepo.save(newRating);
  }

  getStoreRatings(storeId: number) {
    return this.ratingsRepo.createQueryBuilder('rating')
      .leftJoinAndSelect('rating.user', 'user')
      .where('rating.store_id = :storeId', { storeId })
      .getMany();
  }

  getStoreAverage(storeId: number) {
    return this.ratingsRepo.createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .addSelect('COUNT(rating.id)', 'total')
      .where('rating.store_id = :storeId', { storeId })
      .getRawOne();
  }

  getUserRatingForStore(userId: number, storeId: number) {
    return this.ratingsRepo.findOne({ where: { user_id: userId, store_id: storeId } });
  }
}