import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { env } from '../core/environment';

env.config();

const datasource = new DataSource({
  type: 'mssql',
  host: env.database.host ?? 'localhost',
  port: env.database.port ?? 1433,
  username: env.database.username,
  password: env.database.password,
  database: env.database.database,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
  migrations: [__dirname + '/migrations/*.ts'],
  connectionTimeout: env.database.connectionTimeout ?? 60000,
  requestTimeout: env.database.connectionTimeout ?? 60000,
  poolSize: env.database.poolSize ?? 100,
  extra: {
    trustServerCertificate: true,
    requestTimeout: env.database.connectionTimeout ?? 60000,
  },
} as unknown as DataSourceOptions);

export default datasource;
