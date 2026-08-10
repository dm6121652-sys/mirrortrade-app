import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { SignalSource } from './signal-source.entity';
import { SubscribeChannelDto } from './dto/subscribe-channel.dto';

type AuthRequest = Request & { user: AuthenticatedUser };

@Controller('signal-sources')
@UseGuards(JwtAuthGuard)
export class SignalSourcesController {
  constructor(
    @InjectRepository(SignalSource)
    private readonly sources: Repository<SignalSource>,
  ) {}

  // List all channels the logged-in user has subscribed to
  @Get()
  async list(@Req() req: AuthRequest) {
    return this.sources.find({
      where: { userId: req.user.id },
      select: ['id', 'platform', 'external_chat_id', 'display_name', 'is_trusted', 'is_active', 'signal_count', 'created_at'],
      order: { created_at: 'DESC' },
    });
  }

  // Subscribe user to a Telegram channel
  @Post('subscribe')
  async subscribe(@Req() req: AuthRequest, @Body() input: SubscribeChannelDto) {
    const chatId = input.channelIdentifier.trim();

    // Check if this source already exists globally
    let source = await this.sources.findOne({
      where: { platform: 'telegram', external_chat_id: chatId },
    });

    if (!source) {
      // Create the global signal source
      source = await this.sources.save(
        this.sources.create({
          platform: 'telegram',
          external_chat_id: chatId,
          display_name: input.displayName,
          userId: req.user.id,
          is_trusted: false,
          is_active: true,
          metadata: null,
        }),
      );
    } else if (!source.userId) {
      // Claim ownership if unclaimed
      await this.sources.update(source.id, { userId: req.user.id });
    }

    return {
      id: source.id,
      channelIdentifier: chatId,
      displayName: source.display_name,
      status: 'connected',
      isTrusted: source.is_trusted,
    };
  }
}
