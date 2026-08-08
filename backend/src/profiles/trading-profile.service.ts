import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTradingProfileDto } from './dto/update-trading-profile.dto';
import { TradingProfile } from './trading-profile.entity';

@Injectable()
export class TradingProfileService {
  constructor(@InjectRepository(TradingProfile) private readonly profiles: Repository<TradingProfile>) {}

  async getForUser(userId: string): Promise<TradingProfile | null> {
    return this.profiles.findOne({ where: { user: { id: userId } } });
  }

  async updateForUser(userId: string, input: UpdateTradingProfileDto): Promise<TradingProfile> {
    const current = await this.getForUser(userId);
    const values = {
      ...input,
      allowedSymbols: input.allowedSymbols.map((symbol) => symbol.trim().toUpperCase()),
    };
    if (current) return this.profiles.save({ ...current, ...values });
    return this.profiles.save(this.profiles.create({ ...values, user: { id: userId } }));
  }
}
