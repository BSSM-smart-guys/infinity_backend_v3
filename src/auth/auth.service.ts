import config from '@/config';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './payload/tokenPayload.interface';
import { PrismaClient, User } from '@prisma/client';
import { ValidateTokenResponseDto } from '@/user/dto/response/validate-token-response.dto';

const prisma = new PrismaClient();
type UserWithOutPwd = Omit<User, 'pwd'>;
const secret = config().secret.key;
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public createToken(uid: number): string {
    const payload: TokenPayload = { uid };

    return this.jwtService.sign(payload, {
      expiresIn: '12h',
      secret,
    });
  }

  public async validateToken(token: string): Promise<UserWithOutPwd> {
    try {
      const JWT = token.replace('Bearer ', '');
      const verifiedToken: any = this.jwtService.verify(JWT, {
        secret,
      });

      return await prisma.user.findUnique({
        select: { uid: true, id: true, nickname: true },
        where: { uid: verifiedToken.uid },
      });
    } catch (err) {
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

  async validateTokenResponseWithInfo(
    token: string,
  ): Promise<ValidateTokenResponseDto> {
    const targetUser: UserWithOutPwd = await this.validateToken(token);
    const userInfo: UserWithOutPwd = await this.getUserInfo(targetUser);
    const totalLikesCounts: number = await this.getTotalLikesCounts(targetUser);
    const totalNovels = await this.getTotalNovels(targetUser);
    const views: number = await this.getViews(targetUser);

    return ValidateTokenResponseDto.from(
      userInfo,
      totalLikesCounts,
      totalNovels,
      views,
    );
  }

  async getUserInfo(targetUser: UserWithOutPwd): Promise<UserWithOutPwd> {
    return await prisma.user.findUnique({
      select: { uid: true, id: true, nickname: true },
      where: { uid: targetUser.uid },
    });
  }

  async getTotalLikesCounts(targetUser: UserWithOutPwd): Promise<number> {
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

  async getTotalNovels(targetUser: UserWithOutPwd): Promise<{ uid: number }[]> {
    return await prisma.novel.findMany({
      where: {
        user_uid: targetUser.uid,
      },
      select: {
        uid: true,
      },
    });
  }

  async getViews(targetUser: UserWithOutPwd): Promise<number> {
    const {
      _sum: { views },
    } = await prisma.novel.aggregate({
      _sum: { views: true },
      where: { user_uid: targetUser.uid },
    });

    return views;
  }
}
