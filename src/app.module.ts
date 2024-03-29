import { Module } from '@nestjs/common';
import { NovelModule } from './novel/novel.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AiController } from './ai/ai.controller';
import { AiModule } from './ai/ai.module';
import { ImageModule } from './image/image.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    NovelModule,
    UserModule,
    AuthModule,
    AiModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ImageModule,
    CommentModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
