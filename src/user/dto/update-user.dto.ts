import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'user1234',
    description: '업데이트할 유저 아이디에 해당하는 부분입니다.',
  })
  id: string;

  @ApiProperty({
    example: 'user1234',
    description: '업데이트할 유저 닉네임에 해당하는 부분입니다.',
  })
  nickname: string;
}
