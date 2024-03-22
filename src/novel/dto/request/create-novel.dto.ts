import { Category } from '@/novel/enums';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

class CreateNovelDto {
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export default CreateNovelDto;
