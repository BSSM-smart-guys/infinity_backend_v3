import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user1234',
    description: '유저 아이디에 해당하는 부분입니다.',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'qwer@1234',
    description: '비밀번호에 해당하는 부분입니다.',
  })
  @IsString()
  pwd: string;

  @ApiProperty({
    example: 'myNickname',
    description: '별명에 해당하는 부분입니다.',
  })
  @IsString()
  nickname: string;
}
