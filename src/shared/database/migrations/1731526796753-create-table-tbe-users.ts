import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TypeormMigrationExtensions } from '../extensions';

export class CreateTableTbeUsers1731526796753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const phoneTable = new Table({
      name: 'tbe_users',
      comment: 'Table that stores users / Tabela que armazena os usuários.',
      indices: [
        {
          name: 'idx_tbe_users_name',
          columnNames: ['user_name'],
        },
      ],
      columns: [
        {
          name: 'user_id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
          primaryKeyConstraintName: 'pk_tbe_users',
          comment:
            'Identificador sequencial único / Unique sequential identifier',
        },
        {
          name: 'user_name',
          type: 'varchar(100)',
          isNullable: false,
          comment: 'Nome do usuário / User name',
        },
        {
          name: 'user_email',
          type: 'varchar(100)',
          isNullable: false,
          comment: 'Email do usuário / User email',
        },
        {
          name: 'password_hash',
          type: 'varchar(255)',
          isNullable: false,
          comment: 'Hash da senha do usuário / User password hash',
        },
        {
          name: 'creation_timestamp',
          type: 'DATETIMEOFFSET',
          precision: 7,
          isNullable: false,
          default:
            "SYSDATETIMEOFFSET() AT TIME ZONE 'E. South America Standard Time'",
          comment:
            'Data e hora de criação do registro / Record creation date and time',
        },
      ],
    });

    await queryRunner.createTable(phoneTable);

    await TypeormMigrationExtensions.comments(queryRunner, phoneTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbe_users');
  }
}
