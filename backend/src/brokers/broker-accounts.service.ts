import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialEncryptionService } from '../security/credential-encryption.service';
import { BrokerAccount } from './broker-account.entity';
import { CreateDemoAccountDto } from './dto/create-demo-account.dto';

@Injectable()
export class BrokerAccountsService {
  constructor(
    @InjectRepository(BrokerAccount) private readonly accounts: Repository<BrokerAccount>,
    private readonly encryption: CredentialEncryptionService,
  ) {}

  async createDemoAccount(userId: string, input: CreateDemoAccountDto): Promise<BrokerAccount> {
    const accountReference = input.accountReference.trim();
    const existing = await this.accounts.exists({
      where: { broker: input.broker, accountReference },
    });
    if (existing) throw new ConflictException('This broker account is already connected.');

    return this.accounts.save(
      this.accounts.create({
        userId,
        broker: input.broker,
        accountReference,
        credentialsCiphertext: this.encryption.encrypt(input.apiToken),
        credentialsKeyVersion: 1,
        isDemo: true,
        status: 'pending',
      }),
    );
  }

  listForUser(userId: string): Promise<BrokerAccount[]> {
    return this.accounts.find({
      where: { userId },
      select: ['id', 'broker', 'accountReference', 'isDemo', 'status', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }
}
