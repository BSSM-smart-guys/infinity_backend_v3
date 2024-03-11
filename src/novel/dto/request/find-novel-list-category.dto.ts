import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Category } from '@/novel/enums';
import { Type } from 'class-transformer';

class FindNovelListCategoryDto {
  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;

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
