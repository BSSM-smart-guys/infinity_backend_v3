import { Expose } from 'class-transformer';

export class userInfoDto {
  @Expose()
  id: string;
  @Expose()
  nickname: string;
}
