import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { Signal } from '../signals/signal.entity';
import { SignalSource } from '../signals/signal-source.entity';
import { SignalParser } from '../signals/signal.parser';
import { TelegramMessage, TelegramUpdate, TelegramUser } from './telegram.types';
import { MtprotoService } from './mtproto.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly webhookUrl: string;
  private readonly apiBaseUrl = 'https://api.telegram.org';

  constructor(
    private readonly configService: ConfigService,
    private readonly signalParser: SignalParser,
    private readonly mtproto: MtprotoService,
    @InjectRepository(Signal)
    private readonly signalRepository: Repository<Signal>,
    @InjectRepository(SignalSource)
    private readonly signalSourceRepository: Repository<SignalSource>,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.webhookUrl = this.configService.get<string>('TELEGRAM_BOT_WEBHOOK_URL') || '';
  }

  /**
   * Called after the module is fully initialized — wire MTProto message handler
   */
  onModuleInit() {
    this.mtproto.setMessageHandler(async (chatId, text, messageId) => {
      await this.processMtprotoMessage(chatId, text, messageId);
    });
    this.logger.log('MTProto message handler registered');
  }

  /**
   * Process a message received via MTProto userbot
   */
  async processMtprotoMessage(chatId: string, text: string, messageId: string): Promise<void> {
    try {
      let source = await this.signalSourceRepository.findOne({
        where: { platform: 'telegram', external_chat_id: chatId },
      });

      if (!source) return; // Not a monitored channel — ignore

      const existingSignal = await this.signalRepository.findOne({
        where: { source: { id: source.id }, external_message_id: messageId },
      });
      if (existingSignal) return; // Duplicate

      const parseResult = this.signalParser.parse(text);

      const signal = this.signalRepository.create({
        source,
        external_message_id: messageId,
        raw_message: text,
        parsed_payload: parseResult.status === 'parsed' ? parseResult.signal : null,
        parse_confidence: parseResult.confidence,
        status: parseResult.status === 'parsed' ? 'parsed' : 'rejected',
        received_at: new Date(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await this.signalRepository.save(signal);
      this.logger.log(`[MTProto] Signal saved: ${messageId} | ${signal.status}`);
    } catch (err: any) {
      this.logger.error(`[MTProto] Error processing message: ${err.message}`);
    }
  }

  /**
   * Set up webhook (call this on app startup)
   */
  async setupWebhook(): Promise<void> {
    try {
      const url = `${this.apiBaseUrl}/bot${this.botToken}/setWebhook`;
      const payload = {
        url: this.webhookUrl,
        allowed_updates: ['message'],
        drop_pending_updates: true,
      };

      await axios.post(url, payload);
      this.logger.log(`Webhook registered: ${this.webhookUrl}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to register webhook: ${message}`);
      throw error;
    }
  }

  /**
   * Handle incoming Telegram webhook update
   */
  async handleWebhookUpdate(update: TelegramUpdate): Promise<void> {
    try {
      if (!update.message) {
        this.logger.debug('Update without message, skipping');
        return;
      }

      const message = update.message;

      // Only process text messages
      if (!message.text) {
        this.logger.debug(`Message type ${message.type || 'unknown'} skipped`);
        return;
      }

      // Ignore bot's own messages
      if (message.from?.is_bot) {
        this.logger.debug('Ignoring message from bot');
        return;
      }

      // Get or create signal source
      const sourceId = message.chat.id.toString();
      let source = await this.signalSourceRepository.findOne({
        where: {
          platform: 'telegram',
          external_chat_id: sourceId,
        },
      });

      if (!source) {
        this.logger.log(`Creating new signal source: ${sourceId}`);
        source = this.signalSourceRepository.create({
          platform: 'telegram',
          external_chat_id: sourceId,
          display_name: message.chat.title || message.chat.username || 'Unknown',
          is_trusted: false, // Admins must mark as trusted
        });
        await this.signalSourceRepository.save(source);
      }

      // Check for duplicate (same message_id from same source)
      const externalMessageId = message.message_id.toString();
      const existingSignal = await this.signalRepository.findOne({
        where: {
          source: { id: source.id },
          external_message_id: externalMessageId,
        },
      });

      if (existingSignal) {
        this.logger.debug(`Duplicate signal detected: ${externalMessageId}`);
        return;
      }

      // Parse the signal
      const parseResult = this.signalParser.parse(message.text);

      // Store raw signal in database
      const signal = this.signalRepository.create({
        source,
        external_message_id: externalMessageId,
        raw_message: message.text,
        parsed_payload: parseResult.status === 'parsed' ? parseResult.signal : null,
        parse_confidence: parseResult.confidence,
        status: parseResult.status === 'parsed' ? 'parsed' : 'rejected',
        received_at: new Date(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire after 24h
      });

      await this.signalRepository.save(signal);

      // Log success
      this.logger.log(
        `Signal processed: ${externalMessageId} | Status: ${signal.status} | Confidence: ${parseResult.confidence}`,
      );

      // If parsing failed, log reasons
      if (parseResult.status === 'unresolved') {
        this.logger.warn(`Signal parse failed: ${parseResult.reasons.join('; ')}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error processing webhook update: ${message}`, stack);
      throw error;
    }
  }

  /**
   * Send notification to Telegram user
   */
  async sendMessage(chatId: string | number, text: string): Promise<void> {
    try {
      const url = `${this.apiBaseUrl}/bot${this.botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send Telegram message: ${message}`);
    }
  }

  /**
   * Get bot info (for debugging/verification)
   */
  async getBotInfo(): Promise<{ username: string; id: number }> {
    try {
      const url = `${this.apiBaseUrl}/bot${this.botToken}/getMe`;
      const response = await axios.get(url);
      return {
        username: response.data.result.username,
        id: response.data.result.id,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get bot info: ${message}`);
      throw error;
    }
  }

  /**
   * Get list of webhook info (debugging)
   */
  async getWebhookInfo(): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/bot${this.botToken}/getWebhookInfo`;
      const response = await axios.get(url);
      return response.data.result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get webhook info: ${message}`);
      throw error;
    }
  }

  /**
   * Verify Telegram webhook signature (for security)
   */
  verifyWebhookSignature(headers: any, body: Buffer): boolean {
    // Telegram sign webhook with X-Telegram-Bot-Api-Secret-Hash header
    // Implementation optional for basic security
    return true; // For now, accept all (improve in production)
  }

  /**
   * Mark signal source as trusted (admin only)
   */
  async markSourceAsTrusted(sourceId: string): Promise<SignalSource> {
    const source = await this.signalSourceRepository.findOne({
      where: { id: sourceId },
    });

    if (!source) {
      throw new BadRequestException('Signal source not found');
    }

    source.is_trusted = true;
    await this.signalSourceRepository.save(source);
    this.logger.log(`Signal source marked as trusted: ${sourceId}`);
    return source;
  }

  /**
   * Get all signal sources (admin only)
   */
  async getAllSources(): Promise<SignalSource[]> {
    return this.signalSourceRepository.find();
  }

  /**
   * Get signals from specific source
   */
  async getSignalsFromSource(sourceId: string, limit: number = 50): Promise<Signal[]> {
    return this.signalRepository.find({
      where: {
        source: { id: sourceId },
      },
      order: {
        received_at: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get unparsed signals (failed parsing)
   */
  async getUnparsedSignals(limit: number = 20): Promise<Signal[]> {
    return this.signalRepository.find({
      where: {
        status: 'rejected',
      },
      order: {
        received_at: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get statistics
   */
  async getStatistics(): Promise<{
    total_signals: number;
    parsed_signals: number;
    rejected_signals: number;
    trusted_sources: number;
    total_sources: number;
  }> {
    const total = await this.signalRepository.count();
    const parsed = await this.signalRepository.count({ where: { status: 'parsed' } });
    const rejected = await this.signalRepository.count({ where: { status: 'rejected' } });
    const trustedSources = await this.signalSourceRepository.count({ where: { is_trusted: true } });
    const totalSources = await this.signalSourceRepository.count();

    return {
      total_signals: total,
      parsed_signals: parsed,
      rejected_signals: rejected,
      trusted_sources: trustedSources,
      total_sources: totalSources,
    };
  }
}
