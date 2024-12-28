import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('tbe_users')
@Index('idx_tbe_users_name', ['userName'])
export class User {
  @PrimaryGeneratedColumn({
    name: 'user_id',
    type: 'bigint',
    comment: 'Identificador sequencial único / Unique sequential identifier',
  })
  id: number;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nome do usuário / User name',
  })
  userName: string;

  @Column({
    name: 'user_email',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Email do usuário / User email',
  })
  userEmail: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Hash da senha do usuário / User password hash',
  })
  passwordHash: string;

  @CreateDateColumn({
    name: 'creation_timestamp',
    type: 'datetimeoffset',
    precision: 7,
    default: () =>
      "SYSDATETIMEOFFSET() AT TIME ZONE 'E. South America Standard Time'",
    comment:
      'Data e hora de criação do registro / Record creation date and time',
  })
  creationTimestamp: Date;
}
