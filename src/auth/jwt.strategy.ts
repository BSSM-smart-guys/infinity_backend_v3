import * as dotenv from 'dotenv';
dotenv.config();
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
    const userInfo = await prisma.user.findUnique({
      select: { id: true },
      where: { uid: payload.uid },
    });
    if (!userInfo) throw new UnauthorizedException();
    return true;
  }
}
