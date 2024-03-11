import { Novel } from '@prisma/client';
import { PaginationMetaDto } from '@/novel/dto';

interface FindNovelListDto {
  data: Novel[];
  meta: PaginationMetaDto;
}

export default FindNovelListDto;
