import {
  DataSource,
  EntityManager,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';

declare module 'typeorm' {
  type ExecuteInTransactionParams = (
    currentManager: EntityManager,
  ) => Promise<any>;

  interface DataSource {
    currentManager: EntityManager;
    executeInTransaction(ctx: ExecuteInTransactionParams): Promise<any>;
  }
}

const config = (dataSource: DataSource) => {
  DataSource.prototype.currentManager =
    DataSource.prototype.currentManager ??
    dataSource?.currentManager ??
    dataSource?.manager;

  if (dataSource) {
    dataSource.currentManager =
      DataSource.prototype.currentManager ??
      dataSource?.currentManager ??
      dataSource?.manager;
  }

  DataSource.prototype.executeInTransaction = function (
    this: DataSource,
    callable: (em) => any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    return this.manager
      .transaction((ctx) => {
        self.currentManager = ctx;
        dataSource.currentManager = ctx;
        return callable(ctx);
      })
      .finally(() => {
        self.currentManager = this.manager;
        dataSource.currentManager = this.manager;
      });
  };
};

const commentTable = async (
  runner: QueryRunner,
  tableName: string,
  comment: string,
): Promise<void> => {
  await runner.query(
    `
      EXEC sp_addextendedproperty 
      @name = N'MS_Description', 
      @value = N'${comment}', 
      @level0type = N'SCHEMA', @level0name = 'dbo', 
      @level1type = N'TABLE',  @level1name = '${tableName}';
    `,
  );
};

const commentColumn = async (
  runner: QueryRunner,
  tableName: string,
  columnName: string,
  comment: string,
): Promise<void> => {
  await runner.query(
    `
      EXEC sp_addextendedproperty 
      @name = N'MS_Description', 
      @value = N'${comment}', 
      @level0type = N'SCHEMA', @level0name = 'dbo', 
      @level1type = N'TABLE',  @level1name = '${tableName}',  
      @level2type = N'COLUMN', @level2name = '${columnName}';

    `,
  );
};

const comments = async (runner: QueryRunner, table: Table): Promise<void> => {
  if (table?.comment) {
    await commentTable(runner, table.name, table.comment);
  }

  await commentColumns(runner, table);
};

const commentColumns = async (
  runner: QueryRunner,
  tableOrTableColumns: Table | TableColumn[],
  tableName?: string,
): Promise<void> => {
  if (Array.isArray(tableOrTableColumns)) {
    await Promise.all(
      tableOrTableColumns.map(
        async (column) =>
          await commentColumn(runner, tableName, column.name, column.comment),
      ),
    );
  } else {
    await Promise.all(
      tableOrTableColumns.columns.map(async (column) => {
        await commentColumn(
          runner,
          tableOrTableColumns.name,
          column.name,
          column.comment,
        );
      }),
    );
  }
};

export const TypeormMigrationExtensions = {
  commentColumn,
  commentColumns,
  comments,
};

export const TypeormExtensions = {
  config,
};
