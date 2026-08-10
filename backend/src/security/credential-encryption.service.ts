import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

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
    const secret = config.get<string>('ENCRYPTION_KEY') || 'dummy-key-for-development-only-12345678901234';
    if (!config.get<string>('ENCRYPTION_KEY')) {
      console.warn('ENCRYPTION_KEY not set, using dummy key');
    }
    // Hash the secret to ensure it's exactly 32 bytes (256 bits) for AES-256
    this.key = createHash('sha256').update(secret).digest();
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
