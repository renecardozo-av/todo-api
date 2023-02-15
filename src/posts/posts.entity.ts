import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: '250',
  })
  author: string;

  @Column({
    type: 'varchar',
    length: '250',
  })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    default: false
  })
  isDeleted: boolean;
}
