import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { BrokerAccount } from '../brokers/broker-account.entity';
import { TradingProfile } from '../profiles/trading-profile.entity';
import { Signal } from '../signals/signal.entity';
import { SignalSource } from '../signals/signal-source.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        // Use DATABASE_URL if available (Railway), otherwise fall back to individual vars
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, BrokerAccount, TradingProfile, Signal, SignalSource],
            synchronize: false,
            logging: config.get<string>('NODE_ENV') !== 'production',
            ssl: { rejectUnauthorized: false },
          };
        }

        // Fallback for local development
        return {
          type: 'postgres',
          host: config.get<string>('DATABASE_HOST', 'localhost'),
          port: config.get<number>('DATABASE_PORT', 5432),
          username: config.get<string>('DATABASE_USER', 'postgres'),
          password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
          database: config.get<string>('DATABASE_NAME', 'mirrortrade'),
          entities: [User, BrokerAccount, TradingProfile, Signal, SignalSource],
          synchronize: false,
          logging: config.get<string>('NODE_ENV') !== 'production',
          ssl: config.get<boolean>('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
