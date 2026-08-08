import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { SignalSource } from './signal-source.entity';
import { ParsedSignal } from './signal.types';

@Entity('signals')
@Index(['source', 'status', 'created_at'])
@Index(['external_message_id', 'source'])
@Index(['status', 'expires_at'])
export class Signal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  source_id!: string;

  @ManyToOne(() => SignalSource, (source) => source.signals, { eager: true, onDelete: 'CASCADE' })
  source!: SignalSource;

  @Column({ type: 'varchar', length: 255, unique: false })
  external_message_id!: string;

  @Column({ type: 'text' })
  raw_message!: string;

  @Column({ type: 'jsonb', nullable: true })
  parsed_payload!: ParsedSignal | null;

  @Column({ type: 'enum', enum: ['parsed', 'rejected', 'pending'], default: 'pending' })
  status!: 'parsed' | 'rejected' | 'pending';

  @Column({ type: 'float', default: 0 })
  parse_confidence!: number;

  @Column({ type: 'text', array: true, nullable: true })
  parse_errors!: string[] | null;

  @Column({ type: 'timestamp' })
  received_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  /**
   * Mark signal as expired (auto cleanup)
   */
  isExpired(): boolean {
    if (!this.expires_at) return false;
    return new Date() > this.expires_at;
  }

  /**
   * Check if signal was successfully parsed
   */
  isParsed(): boolean {
    return this.status === 'parsed' && this.parsed_payload !== null;
  }

  /**
   * Get parsed signal data safely
   */
  getParsedData(): ParsedSignal | null {
    if (!this.isParsed()) {
      return null;
    }
    return this.parsed_payload;
  }
}
