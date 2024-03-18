import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: '댓글을 작성할 게시물 아이디에 해당하는 부분입니다.',
  })
  @IsInt()
  novel_uid: number;

  @ApiProperty({
    example: '와정말재밌어요.',
    description: '댓글입니다.',
  })
  @IsString()
  review: string;
}
