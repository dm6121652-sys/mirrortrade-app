import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { BrokerAccountsService } from './broker-accounts.service';
import { CreateDemoAccountDto } from './dto/create-demo-account.dto';

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Controller('broker-accounts')
@UseGuards(JwtAuthGuard)
export class BrokerAccountsController {
  constructor(private readonly accounts: BrokerAccountsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.accounts.listForUser(request.user.id);
  }

  @Post('demo')
  createDemo(@Req() request: AuthenticatedRequest, @Body() input: CreateDemoAccountDto) {
    return this.accounts.createDemoAccount(request.user.id, input);
  }
}
