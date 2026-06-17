import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly resetTokens = new Map<string, { email: string; expires: Date }>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role || 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user);

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async googleLogin(idToken: string) {
    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase.auth.getUser(idToken);
    if (error || !data.user?.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const email = data.user.email;
    const name = data.user.user_metadata?.name || email.split('@')[0];

    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: await bcrypt.hash(Math.random().toString(36), 12),
          emailVerified: true,
          avatar: data.user.user_metadata?.avatar_url,
        },
      });
    }

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async appleLogin(identityToken: string, email?: string, name?: string) {
    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase.auth.getUser(identityToken);
    if (error) {
      throw new UnauthorizedException('Invalid Apple token');
    }

    const userEmail = email || data.user?.email;
    if (!userEmail) {
      throw new BadRequestException('Email is required for Apple login');
    }

    const userName = name || userEmail.split('@')[0];

    let user = await this.prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: userEmail,
          name: userName,
          password: await bcrypt.hash(Math.random().toString(36), 12),
          emailVerified: true,
        },
      });
    }

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.resetTokens.set(token, {
      email,
      expires: new Date(Date.now() + 3600000),
    });

    this.logger.log(`Password reset token for ${email}: ${token}`);

    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetData = this.resetTokens.get(token);
    if (!resetData || resetData.expires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { email: resetData.email },
      data: { password: hashedPassword },
    });

    this.resetTokens.delete(token);
    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        dateOfBirth: true,
        phone: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        profile: true,
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private generateToken(user: { id: string; email: string; role: string }): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
    });
  }

  private getSupabaseClient() {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(
      this.configService.get('SUPABASE_URL', ''),
      this.configService.get('SUPABASE_ANON_KEY', ''),
    );
  }
}
