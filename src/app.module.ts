import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AiController } from './ai/ai.controller';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    AiModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AiController],
  providers: [JwtStrategy],
})
export class AppModule {}
