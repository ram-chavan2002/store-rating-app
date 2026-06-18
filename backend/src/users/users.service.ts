import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  findAll(query?: any) {
    const qb = this.usersRepo.createQueryBuilder('user');
    if (query?.name) qb.andWhere('user.name LIKE :name', { name: `%${query.name}%` });
    if (query?.email) qb.andWhere('user.email LIKE :email', { email: `%${query.email}%` });
    if (query?.role) qb.andWhere('user.role = :role', { role: query.role });
    if (query?.sort) qb.orderBy(`user.${query.sort}`, query.order?.toUpperCase() || 'ASC');
    return qb.getMany();
  }

  findOne(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(data: any) {
    const hashed = await bcrypt.hash(data.password as string, 10);
    const user = this.usersRepo.create({ ...data, password: hashed });
    return this.usersRepo.save(user);
  }

  async updatePassword(id: number, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.update(id, { password: hashed });
    return { message: 'Password updated' };
  }
}