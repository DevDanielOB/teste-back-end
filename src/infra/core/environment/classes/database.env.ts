import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class DatabaseEnvironment {
  @IsNotEmpty({ message: 'Database host not provided' })
  host: string;

  @IsNotEmpty({ message: 'No database name provided' })
  database: string;

  @IsNotEmpty({ message: 'You must provide a username for your database' })
  username: string;

  @IsNotEmpty({ message: 'You must provide a password for your database' })
  password: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  poolSize: number;

  @IsBoolean()
  useSSL: boolean;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  connectionTimeout: number;

  serverDevelopmentBr: boolean;

  @Transform(({ value }) => Number(value))
  port: number;

  executeMigrationOnStartup = false;
}
