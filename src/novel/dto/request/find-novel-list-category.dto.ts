import { ViewType } from '@/novel/enums';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class FindNovelListCategoryDto {
  @IsNotEmpty()
  @IsEnum(ViewType)
  viewType: ViewType;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  index: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  size: number;
}

export default FindNovelListCategoryDto;
