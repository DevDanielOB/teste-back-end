import {
  DataSource,
  EntityTarget,
  ExecuteInTransactionParams,
  Repository,
} from 'typeorm';

export abstract class BaseRepository<T> extends Repository<T> {
  protected readonly datasource: DataSource;

  protected constructor(target: EntityTarget<T>, datasource: DataSource) {
    super(target, datasource?.manager);

    this.datasource = datasource;
  }

  executeInTransaction(ctx: ExecuteInTransactionParams): Promise<any> {
    return this.datasource.executeInTransaction(ctx);
  }
}
