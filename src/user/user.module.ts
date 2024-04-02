import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, AuthService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
