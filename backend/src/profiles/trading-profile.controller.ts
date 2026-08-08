import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { UpdateTradingProfileDto } from './dto/update-trading-profile.dto';
import { TradingProfileService } from './trading-profile.service';

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Controller('trading-profile')
@UseGuards(JwtAuthGuard)
export class TradingProfileController {
  constructor(private readonly profiles: TradingProfileService) {}

  @Get()
  get(@Req() request: AuthenticatedRequest) {
    return this.profiles.getForUser(request.user.id);
  }

  @Patch()
  update(@Req() request: AuthenticatedRequest, @Body() input: UpdateTradingProfileDto) {
    return this.profiles.updateForUser(request.user.id, input);
  }
}
