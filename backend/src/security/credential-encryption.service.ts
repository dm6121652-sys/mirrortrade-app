import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

type EncryptedPayload = {
  version: 1;
  iv: string;
  tag: string;
  ciphertext: string;
};

@Injectable()
export class CredentialEncryptionService {
  private readonly key: Buffer;

  constructor(config: ConfigService) {
    this.key = Buffer.from(config.getOrThrow<string>('ENCRYPTION_KEY'), 'base64');
    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be a base64-encoded 32-byte key.');
    }
  }

  encrypt(value: string): Buffer {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const payload: EncryptedPayload = {
      version: 1,
      iv: iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
      ciphertext: ciphertext.toString('base64'),
    };
    return Buffer.from(JSON.stringify(payload), 'utf8');
  }

  decrypt(payloadBuffer: Buffer): string {
    const payload = JSON.parse(payloadBuffer.toString('utf8')) as EncryptedPayload;
    if (payload.version !== 1) throw new Error('Unsupported credential ciphertext version.');
    const decipher = createDecipheriv('aes-256-gcm', this.key, Buffer.from(payload.iv, 'base64'));
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  }
}
