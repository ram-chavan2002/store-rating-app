import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 400, nullable: true })
  address: string;

  @Column({ type: 'enum', enum: ['admin', 'normal_user', 'store_owner'], default: 'normal_user' })
  role: string;

  @CreateDateColumn()
  created_at: Date;
}