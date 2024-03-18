import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CommentController],
  providers: [CommentService, AuthService, JwtService],
})
export class CommentModule {}
