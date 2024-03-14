import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user1234',
    description: '유저 아이디에 해당하는 부분입니다.',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'user1234',
    description: '유저 비밀번호에 해당하는 부분입니다.',
  })
  @IsString()
  pwd: string;
}
