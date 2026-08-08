import { Controller, Post, Body, Logger, UseGuards, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('webhook/telegram')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(private readonly telegramService: TelegramService) {}

  /**
   * Webhook endpoint - receives updates from Telegram
   * POST /webhook/telegram
   * No auth required (Telegram sends unauthenticated)
   */
  @Post()
  async handleUpdate(@Body() update: TelegramUpdate): Promise<{ ok: boolean }> {
    try {
      this.logger.debug(`Received Telegram update: ${update.update_id}`);
      await this.telegramService.handleWebhookUpdate(update);
      return { ok: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error handling Telegram update: ${message}`);
      // Return 200 OK anyway (Telegram will retry failed webhooks)
      return { ok: true };
    }
  }

  /**
   * Get bot info (debugging)
   * GET /webhook/telegram/info
   */
  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getBotInfo() {
    const botInfo = await this.telegramService.getBotInfo();
    const webhookInfo = await this.telegramService.getWebhookInfo();
    const stats = await this.telegramService.getStatistics();

    return {
      bot: botInfo,
      webhook: webhookInfo,
      stats,
    };
  }

  /**
   * Get all signal sources
   * GET /webhook/telegram/sources
   */
  @Get('sources')
  @UseGuards(JwtAuthGuard)
  async getSources() {
    const sources = await this.telegramService.getAllSources();
    return { sources };
  }

  /**
   * Mark source as trusted (admin only)
   * POST /webhook/telegram/sources/:sourceId/trust
   */
  @Post('sources/:sourceId/trust')
  @UseGuards(JwtAuthGuard)
  async trustSource(@Body('sourceId') sourceId: string) {
    const source = await this.telegramService.markSourceAsTrusted(sourceId);
    return {
      message: 'Source marked as trusted',
      source,
    };
  }

  /**
   * Get unparsed signals
   * GET /webhook/telegram/unparsed
   */
  @Get('unparsed')
  @UseGuards(JwtAuthGuard)
  async getUnparsedSignals() {
    const signals = await this.telegramService.getUnparsedSignals(20);
    return { signals, count: signals.length };
  }

  /**
   * Get statistics
   * GET /webhook/telegram/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStatistics() {
    const stats = await this.telegramService.getStatistics();
    return stats;
  }
}
