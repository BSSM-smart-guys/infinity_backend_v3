import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './tokenPayload.interface';
import { PrismaClient, User } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
type UserWithOutPwd = Omit<User, 'pwd'>;

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
        case 'invalid signature':
          throw new HttpException('유효하지 않은 토큰', 401);

        case 'jwt expired':
          throw new HttpException('토큰 만료됨', 410);

        default:
          throw new HttpException('서버 에러', 500);
      }
    }
  }

  async validateTokenResponseWithInfo(token: string) {
    const targetUser = await this.validateToken(token);
    const userInfo = await this.getUserInfo(targetUser);
    const totalLikesCounts = await this.getTotalLikesCounts(targetUser);
    const totalNovels = await this.getTotalNovels(targetUser);
    const views = await this.getViews(targetUser);

    return { userInfo, totalLikesCounts, totalNovels, views };
  }

  async getUserInfo(targetUser): Promise<UserWithOutPwd> {
    return await prisma.user.findUnique({
      select: { uid: true, id: true, nickname: true },
      where: { uid: targetUser.uid },
    });
  }

  async getTotalLikesCounts(targetUser) {
    const usersNovels = await prisma.novel.findMany({
      where: { user_uid: targetUser.uid },
      select: { uid: true },
    });

    const totalLikes = await Promise.all(
      usersNovels.map(async (novel) => {
        return await prisma.novel_Like.count({
          where: { novel_uid: novel.uid },
        });
      }),
    );

    return totalLikes.reduce((acc, curr) => acc + curr, 0);
  }

  async getTotalNovels(targetUser) {
    return await prisma.novel.findMany({
      where: {
        user_uid: targetUser.uid,
      },
      select: {
        uid: true,
      },
    });
  }

  async getViews(targetUser) {
    const {
      _sum: { views },
    } = await prisma.novel.aggregate({
      _sum: { views: true },
      where: { user_uid: targetUser.uid },
    });

    return views;
  }
}
