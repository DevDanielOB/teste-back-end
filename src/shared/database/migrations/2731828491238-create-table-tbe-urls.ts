import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableTbeUrls1731526796754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'tbe_urls',
      columns: [
        {
          name: 'url_id',
          type: 'bigserial',
          isPrimary: true,
        },
        {
          name: 'original_url',
          type: 'varchar',
          isNullable: false,
          length: '1000', // use um tamanho adequado para URLs longas
        },
        {
          name: 'short_url',
          type: 'varchar',
          length: '30',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'user_id',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'click_count',
          type: 'int',
          isNullable: false,
          default: '0',
        },
        {
          name: 'creation_timestamp',
          type: 'timestamptz',
          precision: 7,
          isNullable: false,
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'update_timestamp',
          type: 'timestamptz',
          precision: 7,
          isNullable: false,
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'deleted_at',
          type: 'timestamptz',
          precision: 7,
          isNullable: true,
        },
      ],
      indices: [
        {
          name: 'idx_tbe_urls_short_url',
          columnNames: ['short_url'],
          isUnique: true,
        },
        {
          name: 'idx_tbe_urls_user_id',
          columnNames: ['user_id'],
        },
      ],
    });

    await queryRunner.createTable(table);

    await queryRunner.createForeignKey(
      'tbe_urls',
      new TableForeignKey({
        name: 'fk_tbe_urls_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'tbe_users',
        referencedColumnNames: ['user_id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tbe_urls', 'fk_tbe_urls_user_id');
    await queryRunner.dropTable('tbe_urls');
  }
}
