import * as dotenv from 'dotenv';
dotenv.config();
import {
  HttpException,
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
  constructor(private readonly jwtService: JwtService) {}

  public getJwtToken(uid: number) {
    const payload: TokenPayload = { uid };
    const token = this.jwtService.sign(payload, {
      expiresIn: '12h',
      secret: process.env.SECRET_KEY,
    });
    return token;
  }

  public validateToken(token: string) {
    try {
      const verifiedToken: any = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      const userInfo = prisma.user.findUnique({
        where: { uid: verifiedToken.uid },
      });
      userInfo; // 이거 pwd딜리트하기
      return prisma.user.findUnique({ where: { uid: verifiedToken.uid } });
    } catch (err) {
      console.log(err);
      switch (err.message) {
        case 'invalid token':
        case 'NO_USER':
          throw new HttpException('유효하지 않은 토큰', 401);

        case 'jwt expired':
          throw new HttpException('토큰 만료됨', 410);

        default:
          throw new HttpException('서버 에러', 500);
      }
    }
  }
}
