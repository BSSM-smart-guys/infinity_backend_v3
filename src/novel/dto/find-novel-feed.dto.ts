import { Novel } from '@prisma/client';
import { PaginationMetaDto } from '@/novel/dto/index';

interface FindNovelFeedDto {
  data: Novel[];
  meta: PaginationMetaDto;
}

export default FindNovelFeedDto;
