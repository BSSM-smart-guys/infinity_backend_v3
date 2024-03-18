import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  novel_uid: number;

  @IsString()
  review: string;
}
