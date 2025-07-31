import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { env } from '../environment';

env.config();

const datasource = new DataSource({
  type: 'postgres',
  host: env.database.host ?? 'localhost',
  port: env.database.port ?? 5432,
  username: env.database.username,
  password: env.database.password,
  database: env.database.database,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
  migrations: [__dirname + '/migrations/*.ts'],
} as unknown as DataSourceOptions);

export default datasource;
