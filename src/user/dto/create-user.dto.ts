import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  pwd: string;

  @IsString()
  nickname: string;
}
