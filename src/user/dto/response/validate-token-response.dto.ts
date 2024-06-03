import { User } from '@prisma/client';
import { Expose, plainToInstance } from 'class-transformer';

export class ValidateTokenResponseDto {
  @Expose()
  userInfo: Omit<User, 'pwd'>;

  @Expose()
  totalLikesCounts: number;

  @Expose()
  totalNovels: { uid: number }[];

  @Expose()
  views: number;

  static from(
    userInfo: Omit<User, 'pwd'>,
    totalLikesCounts: number,
    totalNovels: { uid: number }[],
    views: number,
  ): ValidateTokenResponseDto {
    return plainToInstance(ValidateTokenResponseDto, {
      userInfo,
      totalLikesCounts,
      totalNovels,
      views,
    });
  }
}
