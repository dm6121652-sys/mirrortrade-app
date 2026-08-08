import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BrokersModule } from './brokers/brokers.module';
import { HealthModule } from './health/health.module';
import { RiskModule } from './risk/risk.module';
import { TradingProfileModule } from './profiles/trading-profile.module';
import { SignalsModule } from './signals/signals.module';
import { validateEnvironment } from './config/environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: config.getOrThrow<number>('DATABASE_PORT'),
        username: config.getOrThrow<string>('DATABASE_USER'),
        password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: config.get<boolean>('DATABASE_SSL') ? { rejectUnauthorized: false } : false,
      }),
    }),
    HealthModule,
    RiskModule,
    AuthModule,
    TradingProfileModule,
    BrokersModule,
    SignalsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
