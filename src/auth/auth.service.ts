import * as dotenv from 'dotenv';
dotenv.config();
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './tokenPayload.interface';
import { UserService } from 'src/user/user.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public getJwtToken(uid: number) {
    const payload: TokenPayload = { uid };
    const token = this.jwtService.sign(payload, {
      expiresIn: '12h',
      secret: process.env.SECRET_KEY,
    });
    return token;
  }

  async validateUser(token: any) {
    console.log(token.uid);
    const userInfo = await prisma.user.findUnique({
      select: { id: true },
      where: { uid: token.uid },
    });
    if (!userInfo) throw new UnauthorizedException();
    return userInfo;
  }
}
