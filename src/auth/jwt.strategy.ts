import * as dotenv from 'dotenv';
dotenv.config();
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    });
  }
  async validate(payload: any) {
    const user: User = await prisma.user.findUnique({
      where: { uid: payload.uid },
    });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
