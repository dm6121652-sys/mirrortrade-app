import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterDto) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.users.exists({ where: { email } });
    if (existing) throw new ConflictException('An account already exists for this email address.');

    const user = this.users.create({
      email,
      passwordHash: await bcrypt.hash(input.password, 12),
    });
    await this.users.save(user);
    return this.issueToken(user);
  }

  async login(input: LoginDto) {
    const email = input.email.trim().toLowerCase();
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
    if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return this.issueToken(user);
  }

  private issueToken(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role, onboardingCompleted: user.onboardingCompleted };
    return {
      accessToken: this.jwt.sign(payload),
      user: payload,
    };
  }
}
