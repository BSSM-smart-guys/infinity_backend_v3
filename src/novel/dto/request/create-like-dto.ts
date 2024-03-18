import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

class CreateLikeDto {
  @ApiProperty({
    example: 1,
    description: '유저 고유 아이디(번호)에 해당하는 부분입니다.',
  })
  @IsInt()
  user_uid: number;
}
export default CreateLikeDto;
