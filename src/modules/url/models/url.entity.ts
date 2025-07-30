import { User } from 'src/modules/user/models/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tbe_urls')
export class Url {
  @PrimaryGeneratedColumn('increment', { name: 'url_id' })
  id: number;

  @Column('varchar', { name: 'original_url', nullable: false })
  originalUrl: string;

  @Column('varchar', {
    name: 'short_url',
    length: 40,
    nullable: false,
    unique: true,
  })
  shortUrl: string;

  @Column('bigint', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('int', { name: 'click_count', default: 0, nullable: false })
  clickCount: number;

  @CreateDateColumn({
    name: 'creation_timestamp',
    type: 'datetimeoffset',
    precision: 7,
    default: () =>
      "SYSDATETIMEOFFSET() AT TIME ZONE 'E. South America Standard Time'",
  })
  creationTimestamp: Date;

  @UpdateDateColumn({
    name: 'update_timestamp',
    type: 'datetimeoffset',
    precision: 7,
    default: () =>
      "SYSDATETIMEOFFSET() AT TIME ZONE 'E. South America Standard Time'",
    onUpdate:
      "SYSDATETIMEOFFSET() AT TIME ZONE 'E. South America Standard Time'",
  })
  updateTimestamp: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetimeoffset',
    precision: 7,
    nullable: true,
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.urls, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User | null;
}
