import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type BrokerAccountStatus = 'pending' | 'active' | 'paused' | 'revoked';

@Entity({ name: 'broker_accounts' })
export class BrokerAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column()
  broker!: string;

  @Column({ name: 'account_reference' })
  accountReference!: string;

  @Column({ name: 'credentials_ciphertext', type: 'bytea', select: false })
  credentialsCiphertext!: Buffer;

  @Column({ name: 'credentials_key_version', type: 'smallint', default: 1 })
  credentialsKeyVersion!: number;

  @Column({ name: 'is_demo', default: true })
  isDemo!: boolean;

  @Column({ type: 'enum', enum: ['pending', 'active', 'paused', 'revoked'], enumName: 'account_status', default: 'pending' })
  status!: BrokerAccountStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
