import { ConsoleLogger } from '@nestjs/common';
import { plainToInstance, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Environment } from '../enums/env.enum';
import { readEnv } from '../read-env';
import { DatabaseEnvironment } from './database.env';
import { validateAndReturnErrors } from '../../utils/library';

export class AppEnvironment {
  @IsEnum(Environment)
  @Transform(({ value }) => value ?? Environment.DEVELOPMENT)
  nodeEnv: Environment;

  @Transform(({ value }) => value ?? 'America/Sao_Paulo')
  timezone: string;
  @IsNumber()
  @Transform(({ value }) => Number(value))
  port: number;

  @ValidateNested()
  database: DatabaseEnvironment;

  @IsString()
  jwtSecret: string;

  @IsString()
  base_url: string;

  config() {
    const newEnv = plainToInstance(AppEnvironment, readEnv(), {
      enableImplicitConversion: true,
    });
    const errors = validateAndReturnErrors(newEnv);

    if (errors.length > 0) {
      new ConsoleLogger().error(
        `Failed to load enviroment variables: \n ${errors.join('\n')} `,
      );
      process.exit(0);
    }

    Object.assign(this, newEnv);
  }
}
