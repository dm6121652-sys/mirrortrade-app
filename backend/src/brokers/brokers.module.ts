import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityModule } from '../security/security.module';
import { BrokerAccount } from './broker-account.entity';
import { BrokerAccountsController } from './broker-accounts.controller';
import { BrokerAccountsService } from './broker-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerAccount]), SecurityModule],
  controllers: [BrokerAccountsController],
  providers: [BrokerAccountsService],
})
export class BrokersModule {}
