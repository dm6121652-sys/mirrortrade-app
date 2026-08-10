import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { Signal } from './signal.entity';

type AuthRequest = Request & { user: AuthenticatedUser };

@Controller('signals')
@UseGuards(JwtAuthGuard)
export class SignalsController {
  constructor(
    @InjectRepository(Signal)
    private readonly signals: Repository<Signal>,
  ) {}

  /**
   * GET /api/v1/signals
   * Returns recent signals with optional status filter and limit.
   */
  @Get()
  async list(
    @Req() req: AuthRequest,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    const take = Math.min(parseInt(limit ?? '50', 10) || 50, 200);

    const qb = this.signals
      .createQueryBuilder('signal')
      .leftJoinAndSelect('signal.source', 'source')
      .where('source.userId = :userId', { userId: req.user.id })
      .orderBy('signal.received_at', 'DESC')
      .take(take);

    if (status) {
      qb.andWhere('signal.status = :status', { status });
    }

    const results = await qb.getMany();

    return results.map((s) => ({
      id: s.id,
      source_id: s.source_id,
      external_message_id: s.external_message_id,
      raw_message: s.raw_message,
      status: s.status,
      parse_confidence: s.parse_confidence,
      received_at: s.received_at,
      created_at: s.created_at,
      source: s.source
        ? {
            display_name: s.source.display_name,
            external_chat_id: s.source.external_chat_id,
            platform: s.source.platform,
          }
        : null,
      parsed_payload: s.parsed_payload,
    }));
  }
}
