import { Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { User } from './user.entity';

type AuthRequest = Request & { user: AuthenticatedUser };

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  @Patch('me/complete-onboarding')
  async completeOnboarding(@Req() req: AuthRequest) {
    await this.users.update(req.user.id, { onboardingCompleted: true });
    return { success: true };
  }
}
