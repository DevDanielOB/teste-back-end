import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTbeUsers1731526796753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'tbe_users',
      columns: [
        {
          name: 'user_id',
          type: 'bigserial',
          isPrimary: true,
        },
        {
          name: 'user_name',
          type: 'varchar',
          length: '100',
          isNullable: false,
        },
        {
          name: 'user_email',
          type: 'varchar',
          length: '100',
          isNullable: false,
        },
        {
          name: 'password_hash',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'creation_timestamp',
          type: 'timestamptz',
          precision: 7,
          isNullable: false,
          default: 'CURRENT_TIMESTAMP',
        },
      ],
      indices: [
        {
          name: 'idx_tbe_users_name',
          columnNames: ['user_name'],
        },
      ],
    });

    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbe_users');
  }
}
