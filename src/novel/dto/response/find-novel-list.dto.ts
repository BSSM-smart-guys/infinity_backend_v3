import { Novel } from '@prisma/client';
import { PaginationMetaDto } from '@/novel/dto';
import { plainToInstance } from 'class-transformer';

class FindNovelListDto {
  data: Novel[];
  meta: PaginationMetaDto;

  static listOf(data: Novel[], meta: PaginationMetaDto): FindNovelListDto {
    return plainToInstance(FindNovelListDto, { data, meta });
  }
}

export default FindNovelListDto;
