import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BrokersModule } from './brokers/brokers.module';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { TradingProfileModule } from './profiles/trading-profile.module';
import { RiskModule } from './risk/risk.module';
import { SecurityModule } from './security/security.module';
import { SignalsModule } from './signals/signals.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // Core Modules
    AuthModule,
    UsersModule,
    ConfigurationModule,
    SecurityModule,

    // Trading Modules
    BrokersModule,
    SignalsModule,
    TradingProfileModule,
    RiskModule,

    // External Integrations
    TelegramModule, // ← NEW: Telegram signal ingestion

    // Health Checks
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    this.logStartupInfo();
  }

  private logStartupInfo(): void {
    const env = this.configService.get<string>('NODE_ENV', 'development');
    const telegramToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    console.log(`
╔════════════════════════════════════════════════╗
║          MirrorTrade Backend Started           ║
╠════════════════════════════════════════════════╣
║ Environment:  ${env.padEnd(38)} ║
║ Telegram Bot: ${telegramToken ? '✅ Configured'.padEnd(38) : '❌ Not Configured'.padEnd(38)} ║
║ Modules:      Auth, Users, Brokers,            ║
║               Signals, Telegram, Risk          ║
╚════════════════════════════════════════════════╝
    `);
  }
}
