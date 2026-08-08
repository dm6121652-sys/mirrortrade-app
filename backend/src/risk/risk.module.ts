import { Module } from '@nestjs/common';
import { RiskEngine } from './risk.engine';

@Module({
  providers: [RiskEngine],
  exports: [RiskEngine],
})
export class RiskModule {}
