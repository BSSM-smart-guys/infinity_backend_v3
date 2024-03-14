import { ApiProperty } from '@nestjs/swagger';

export class KeywordDto {
  @ApiProperty({
    example: '공주, 왕자, 드래곤',
    description: '등장인물에 해당하는 부분입니다.',
  })
  characters: string;

  @ApiProperty({
    example: '왕자가 드래곤을 사냥하고 공주를 구하러 떠났다.',
    description: '사건에 해당하는 부분입니다.',
  })
  events: string;

  @ApiProperty({
    example: '중세',
    description: '배경에 해당하는 부분입니다.',
  })
  backgrounds: string;
}
