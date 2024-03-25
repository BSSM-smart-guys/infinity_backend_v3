import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './tokenPayload.interface';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public createToken(uid: number) {
    const payload: TokenPayload = { uid };
    return this.jwtService.sign(payload, {
      expiresIn: '12h',
      secret: process.env.SECRET_KEY,
    });
  }

  public async validateToken(token: string) {
    try {
      const [Bearer, JWT] = token.split(' ');
      const verifiedToken: any = this.jwtService.verify(JWT, {
        secret: process.env.SECRET_KEY,
      });
      return await prisma.user.findUnique({
        select: { uid: true, id: true, nickname: true },
        where: { uid: verifiedToken.uid },
      });
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

  async validateTokenWithInfo(token: string) {
    const targetUser = await this.validateToken(token);

    const userInfo = await prisma.user.findUnique({
      select: { uid: true, id: true, nickname: true },
      where: { uid: targetUser.uid },
    });

    const usersNovels = await prisma.novel.findMany({
      where: {
        user_uid: targetUser.uid,
      },
      select: {
        uid: true,
      },
    });

    const totalLikes = usersNovels.map(async (novel) => {
      return await prisma.novel_Like.count({
        where: {
          novel_uid: novel.uid,
        },
      });
    });

    let totalLikesCount = 0;

    for (const e of totalLikes) {
      totalLikesCount += await e;
    }

    const totalNovels = await prisma.novel.count({
      where: {
        user_uid: targetUser.uid,
      },
    });
    const {
      _sum: { views },
    } = await prisma.novel.aggregate({
      _sum: {
        views: true,
      },
      where: {
        user_uid: targetUser.uid,
      },
    });
    return { userInfo, totalLikesCount, totalNovels, views };
  }
}
