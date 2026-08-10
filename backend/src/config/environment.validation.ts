import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV = Environment.Production;

  @IsString()
  APP_NAME: string;

  @IsNumber()
  APP_PORT: number = 3000;

  // Database
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number = 5432;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  // JWT
  @IsString()
  JWT_SECRET: string;

  // Telegram (optional)
  @IsString()
  TELEGRAM_BOT_TOKEN?: string;

  @IsString()
  TELEGRAM_BOT_WEBHOOK_URL?: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true, // THIS CONVERTS STRINGS TO NUMBERS!
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
