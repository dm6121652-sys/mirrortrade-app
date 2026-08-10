import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient } from 'teleproto';
import { StringSession } from 'teleproto/sessions';
import { NewMessage, NewMessageEvent } from 'teleproto/events';
import { Api } from 'teleproto/tl';

export interface ChannelInfo {
  id: string;
  title: string;
  username: string | null;
  memberCount: number;
  isPublic: boolean;
  description: string | null;
}

@Injectable()
export class MtprotoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MtprotoService.name);
  private client: TelegramClient;
  private isReady = false;

  // Callback fired when a new message arrives in any monitored channel
  private messageHandler: ((chatId: string, text: string, messageId: string) => void) | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const apiIdStr = this.config.get<string>('TELEGRAM_API_ID');
    const apiHash = this.config.get<string>('TELEGRAM_API_HASH');
    const sessionStr = this.config.get<string>('TELEGRAM_SESSION');

    if (!apiIdStr || !apiHash || !sessionStr) {
      this.logger.warn('⚠️ MTProto credentials missing (TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION). Userbot is DISABLED.');
      return;
    }

    const apiId = parseInt(apiIdStr, 10);
    const session = new StringSession(sessionStr);
    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 5,
    });

    try {
      await this.client.connect();
      this.isReady = true;
      this.logger.log('✅ MTProto userbot connected to Telegram');
      this.startListening();
    } catch (err: any) {
      this.logger.error('❌ Failed to connect MTProto client: ' + err.message);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
      this.logger.log('MTProto client disconnected');
    }
  }

  /**
   * Set callback for incoming messages (used by TelegramService to process signals)
   */
  setMessageHandler(handler: (chatId: string, text: string, messageId: string) => void) {
    this.messageHandler = handler;
  }

  /**
   * Listen to all new messages across all joined channels/groups
   */
  private startListening() {
    this.client.addEventHandler((event: NewMessageEvent) => {
      const msg = event.message;
      if (!msg?.text || !msg.chatId) return;

      const chatId = msg.chatId.toString();
      const text = msg.text;
      const messageId = msg.id.toString();

      if (this.messageHandler) {
        this.messageHandler(chatId, text, messageId);
      }
    }, new NewMessage({}));

    this.logger.log('👂 Listening for new messages from all joined channels');
  }

  /**
   * Resolve a channel by @username or invite link and return its info
   */
  async resolveChannel(identifier: string): Promise<ChannelInfo> {
    this.ensureReady();

    // Clean up the identifier
    const handle = identifier.trim().replace(/^https?:\/\/t\.me\//, '@');

    try {
      const entity = await this.client.getEntity(handle);

      if (!(entity instanceof Api.Channel) && !(entity instanceof Api.Chat)) {
        throw new Error('This is not a channel or group.');
      }

      let memberCount = 0;
      let description: string | null = null;

      if (entity instanceof Api.Channel) {
        const full = await this.client.invoke(
          new Api.channels.GetFullChannel({ channel: entity }),
        );
        memberCount = (full as any).fullChat?.participantsCount ?? 0;
        description = (full as any).fullChat?.about ?? null;
      }

      const id = entity instanceof Api.Channel
        ? `-100${entity.id.toString()}`
        : entity.id.toString();

      const username = entity instanceof Api.Channel
        ? (entity.username ? `@${entity.username}` : null)
        : null;

      const isPublic = entity instanceof Api.Channel
        ? !entity.megagroup && !!entity.username
        : false;

      return {
        id,
        title: (entity as any).title ?? handle,
        username,
        memberCount,
        isPublic,
        description,
      };
    } catch (err: any) {
      if (err.message?.includes('USERNAME_NOT_OCCUPIED') || err.message?.includes('USERNAME_INVALID')) {
        throw new Error(`Channel "${identifier}" not found. Make sure the username is correct.`);
      }
      throw new Error(`Could not resolve channel: ${err.message}`);
    }
  }

  /**
   * Join a channel/group by identifier
   */
  async joinChannel(identifier: string): Promise<void> {
    this.ensureReady();

    const handle = identifier.trim().replace(/^https?:\/\/t\.me\//, '@');

    try {
      await this.client.invoke(
        new Api.channels.JoinChannel({ channel: handle }),
      );
      this.logger.log(`✅ Joined channel: ${handle}`);
    } catch (err: any) {
      if (err.message?.includes('CHANNEL_PRIVATE')) {
        throw new Error('This channel is private. Only public channels can be connected this way.');
      }
      if (err.message?.includes('USER_ALREADY_PARTICIPANT')) {
        this.logger.log(`Already a member of: ${handle}`);
        return; // not an error
      }
      throw new Error(`Failed to join channel: ${err.message}`);
    }
  }

  private ensureReady() {
    if (!this.isReady) {
      throw new Error('Telegram MTProto client is not connected yet. Please try again shortly.');
    }
  }
}
