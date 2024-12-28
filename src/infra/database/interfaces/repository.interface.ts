import { EntityManager } from 'typeorm';

export type ExecuteInTransactionParams = (
  currentManager: EntityManager,
) => Promise<any>;

export interface IRepository {
  executeInTransaction(ctx: ExecuteInTransactionParams): Promise<any>;
}
