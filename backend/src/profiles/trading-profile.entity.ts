import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'trading_profiles' })
export class TradingProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'copy_trading_enabled', default: false })
  copyTradingEnabled!: boolean;

  @Column({ name: 'kill_switch_enabled', default: false })
  killSwitchEnabled!: boolean;

  @Column({ name: 'max_risk_per_trade', type: 'numeric', precision: 6, scale: 3, default: 1 })
  maxRiskPerTrade!: string;

  @Column({ name: 'max_daily_loss', type: 'numeric', precision: 14, scale: 2, default: 0 })
  maxDailyLoss!: string;

  @Column({ name: 'max_open_positions', default: 3 })
  maxOpenPositions!: number;

  @Column({ name: 'allowed_symbols', type: 'text', array: true, default: () => "'{}'" })
  allowedSymbols!: string[];

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
