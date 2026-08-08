import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Signal } from './signal.entity';

@Entity('signal_sources')
@Index(['platform', 'external_chat_id'], { unique: true })
@Index(['is_trusted', 'created_at'])
export class SignalSource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  platform!: 'telegram' | 'email' | 'webhook' | 'api';

  @Column({ type: 'varchar', length: 255 })
  external_chat_id!: string;

  @Column({ type: 'varchar', length: 255 })
  display_name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'boolean', default: false })
  is_trusted!: boolean;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: {
    member_count?: number;
    language?: string;
    category?: string;
    [key: string]: any;
  } | null;

  @Column({ type: 'integer', default: 0 })
  signal_count!: number;

  @Column({ type: 'integer', default: 0 })
  parsed_count!: number;

  @Column({ type: 'integer', default: 0 })
  rejected_count!: number;

  @Column({ type: 'timestamp', nullable: true })
  last_signal_at!: Date | null;

  @Column({ type: 'float', default: 0 })
  average_confidence!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany(() => Signal, (signal) => signal.source, { lazy: true })
  signals!: Signal[];
}
