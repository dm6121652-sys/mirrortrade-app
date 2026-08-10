import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MtprotoService } from './mtproto.service';
import { ConnectChannelDto } from './dto/connect-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignalSource } from '../signals/signal-source.entity';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@Controller('telegram/sources')
@UseGuards(JwtAuthGuard)
export class ChannelSourcesController {
  constructor(
    private readonly mtproto: MtprotoService,
    @InjectRepository(SignalSource)
    private readonly signalSources: Repository<SignalSource>,
  ) {}

  /**
   * POST /api/v1/telegram/sources
   * Resolve, join and store a Telegram channel for this user.
   */
  @Post()
  async connectChannel(
    @Req() req: AuthenticatedRequest,
    @Body() body: ConnectChannelDto,
  ) {
    const { channel_identifier } = body;

    // 1. Resolve channel info via MTProto
    let channelInfo;
    try {
      channelInfo = await this.mtproto.resolveChannel(channel_identifier);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }

    // 2. Join the channel as the userbot
    try {
      await this.mtproto.joinChannel(channel_identifier);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }

    // 3. Check if already stored for this user
    const existing = await this.signalSources.findOne({
      where: {
        platform: 'telegram',
        external_chat_id: channelInfo.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      // 4. Save to database
      const source = this.signalSources.create({
        platform: 'telegram',
        external_chat_id: channelInfo.id,
        display_name: channelInfo.title,
        userId: req.user.id,
        is_trusted: true,
        is_active: true,
        metadata: {
          username: channelInfo.username,
          member_count: channelInfo.memberCount,
          description: channelInfo.description,
        },
      });
      await this.signalSources.save(source);
    }

    return {
      ok: true,
      channel: channelInfo,
    };
  }

  /**
   * GET /api/v1/telegram/sources
   * List all channels connected by this user.
   */
  @Get()
  async listChannels(@Req() req: AuthenticatedRequest) {
    const sources = await this.signalSources.find({
      where: { userId: req.user.id, platform: 'telegram' },
      order: { created_at: 'DESC' },
    });

    return {
      sources: sources.map((s) => ({
        id: s.id,
        title: s.display_name,
        chatId: s.external_chat_id,
        username: s.metadata?.username ?? null,
        memberCount: s.metadata?.member_count ?? 0,
        isActive: s.is_active,
        connectedAt: s.created_at,
      })),
    };
  }
}
