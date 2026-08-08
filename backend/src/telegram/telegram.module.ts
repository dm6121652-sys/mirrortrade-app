import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { Signal } from '../signals/signal.entity';
import { SignalSource } from '../signals/signal-source.entity';
import { SignalParser } from '../signals/signal.parser';

@Module({
  imports: [TypeOrmModule.forFeature([Signal, SignalSource])],
  providers: [TelegramService, SignalParser],
  controllers: [TelegramController],
  exports: [TelegramService],
})
export class TelegramModule implements OnModuleInit {
  constructor(private readonly telegramService: TelegramService) {}

  /**
   * Run on app startup - set up webhook
   */
  async onModuleInit() {
    try {
      console.log('🚀 Setting up Telegram webhook...');
      await this.telegramService.setupWebhook();
      console.log('✅ Telegram webhook configured');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('⚠️ Failed to setup Telegram webhook:', message);
      console.error('Make sure TELEGRAM_BOT_TOKEN and TELEGRAM_BOT_WEBHOOK_URL are set in .env');
    }
  }
}
