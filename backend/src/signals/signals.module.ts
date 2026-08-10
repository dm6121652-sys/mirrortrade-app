import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalParser } from './signal.parser';
import { SignalSource } from './signal-source.entity';
import { Signal } from './signal.entity';
import { SignalSourcesController } from './signal-sources.controller';
import { SignalsController } from './signals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SignalSource, Signal])],
  controllers: [SignalSourcesController, SignalsController],
  providers: [SignalParser],
  exports: [SignalParser, TypeOrmModule],
})
export class SignalsModule {}

