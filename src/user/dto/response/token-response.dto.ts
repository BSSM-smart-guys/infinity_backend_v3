import { Expose, plainToInstance } from 'class-transformer';

export class TokenResponseDto {
  @Expose()
  token: string;

  static of(token: string): TokenResponseDto {
    return plainToInstance(TokenResponseDto, token);
  }
}
