import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingProfileController } from './trading-profile.controller';
import { TradingProfile } from './trading-profile.entity';
import { TradingProfileService } from './trading-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([TradingProfile])],
  controllers: [TradingProfileController],
  providers: [TradingProfileService],
})
export class TradingProfileModule {}
