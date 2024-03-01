import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ViewType } from '@/novel/enums';

class SearchNovelListDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  index: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  size: number;

  @IsEnum(ViewType)
  @IsOptional()
  viewType: ViewType = ViewType.LATEST;
}

export default SearchNovelListDto;
