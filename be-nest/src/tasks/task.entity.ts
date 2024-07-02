import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ETaskStatus } from './tasks.model';
import { UserEntity } from 'src/auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ETaskStatus;

  @DeleteDateColumn()
  deleteAt?: Date;

  @CreateDateColumn()
  createAt?: Date;

  @ManyToOne((_type) => UserEntity, (user) => user.tasks, { eager: false })
  @Exclude({
    toPlainOnly: true,
  })
  user: UserEntity;
}
