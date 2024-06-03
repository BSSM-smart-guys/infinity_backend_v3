import config from '@/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { TokenPayload } from './payload/tokenPayload.interface';

const prisma = new PrismaClient();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config().secret.key,
    });
  }
  async validate(payload: TokenPayload) {
    const user: User = await prisma.user.findUnique({
      where: { uid: payload.uid },
    });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
