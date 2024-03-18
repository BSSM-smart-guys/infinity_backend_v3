import { IsInt } from 'class-validator';

class CreateLikeDto {
  @IsInt()
  user_uid: number;
}
export default CreateLikeDto;
