import { Module } from '@nestjs/common';
import { SignalParser } from './signal.parser';

@Module({
  providers: [SignalParser],
  exports: [SignalParser],
})
export class SignalsModule {}
