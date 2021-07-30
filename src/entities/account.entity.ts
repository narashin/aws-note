import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountName: string;

  @Column()
  accountNumber: number;

  @Column()
  accessKey: string;

  @Column()
  secretKey: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;
}
