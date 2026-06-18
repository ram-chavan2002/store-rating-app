import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';

@Injectable()
export class StoresService {
  constructor(@InjectRepository(Store) private storesRepo: Repository<Store>) {}

  findAll(query?: any) {
    const qb = this.storesRepo.createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoin('store.ratings', 'rating')
      .addSelect('AVG(rating.rating)', 'avg_rating')
      .groupBy('store.id');

    if (query?.name) qb.andWhere('store.name LIKE :name', { name: `%${query.name}%` });
    if (query?.address) qb.andWhere('store.address LIKE :address', { address: `%${query.address}%` });
    if (query?.sort) qb.orderBy(`store.${query.sort}`, query.order?.toUpperCase() || 'ASC');
    return qb.getRawAndEntities();
  }

  findOne(id: number) {
    return this.storesRepo.createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .where('store.id = :id', { id })
      .getOne();
  }

  create(data: any) {
    const store = this.storesRepo.create(data);
    return this.storesRepo.save(store);
  }
}