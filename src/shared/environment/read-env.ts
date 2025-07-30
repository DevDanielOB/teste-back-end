import { AppEnvironment } from './classes/app.env';
import { config } from 'dotenv';
import * as process from 'node:process';
config();

export const readEnv = () => {
  const envReaded = {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    timezone: process.env.TZ,
    database: {
      host: process.env.SQL_SERVER_HOST,
      port: process.env.SQL_SERVER_PORT,
      username: process.env.SQL_SERVER_USER,
      database: process.env.SQL_SERVER_DATABASE,
      password: process.env.SQL_SERVER_PASSWORD,
      poolSize: process.env.SQL_SERVER_POOL_SIZE || 10,
      useSSL: process.env.SQL_SERVER_SSL === 'Y',
      connectionTimeout: process.env.SQL_SERVER_TIMEOUT_SECONDS || 3000,
      serverDevelopmentBr: process.env.SQL_SERVER_DEVELOPMENT_BR === 'Y',
      connectionString: `sqlserver://${process.env.SQL_SERVER_HOST}:${process.env.SQL_SERVER_PORT};database=${process.env.SQL_SERVER_DATABASE};user=${process.env.SQL_SERVER_USER};password=${process.env.SQL_SERVER_PASSWORD};connectionTimeout=${
        process.env.SQL_SERVER_TIMEOUT_SECONDS ?? 30000
      };trustServerCertificate=true;connectionLimit=${process.env.SQL_SERVER_POOL_SIZE ?? 10}`,
    },
    jwtSecret: process.env.JWT_SECRET,
    base_url: `${process.env.APP_URL}:${process.env.PORT}`,
  } as unknown as AppEnvironment;

  return envReaded;
};
