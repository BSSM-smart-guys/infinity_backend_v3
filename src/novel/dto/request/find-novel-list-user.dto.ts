import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { UserFeedType } from '@/novel/enums';
import { Type } from 'class-transformer';

class FindNovelListUserDto {
  @IsNotEmpty()
  @IsEnum(UserFeedType)
  userFeedType: UserFeedType;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  index: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  size: number;
}

export default FindNovelListUserDto;
