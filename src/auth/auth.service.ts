import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface User {
  id: string;
  email: string;
  role: string;
  password?: string;
}

export interface TokenResponseDto {
  message: string;
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email sudah digunakan');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(dto.password.trim(), 10);

    const user = await this.usersService.create({
      username: dto.username,
      name: dto.name,
      email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
      role: 'user',
    });

    return {
      message: 'Registrasi berhasil',
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(
      email.toLowerCase().trim(),
    );

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    if (!user.password) {
      throw new UnauthorizedException('Password tidak tersedia');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    return user;
  }

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);

    return {
      message: 'Berhasil',
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
