import { Module } from '@nestjs/common';
import { NovelService } from './novel.service';
import { NovelController } from './novel.controller';
import { NovelPaginationService } from '@/novel/novel.pagination.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [NovelModule],
  controllers: [NovelController],
  providers: [NovelService, NovelPaginationService, JwtService, AuthService],
})
export class NovelModule {}
