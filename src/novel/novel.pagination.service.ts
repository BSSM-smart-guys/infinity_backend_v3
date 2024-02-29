import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import PaginationMetaDto from '@/novel/dto/pagination.meta.dto';

const prisma = new PrismaClient();

@Injectable()
export class NovelPaginationService {
  async getMetadata(
    index: number,
    size: number,
  ): Promise<PaginationMetaDto> {
    const total: number = await prisma.novel.count();
    const lastPage: number = Math.ceil(total / size);

    return {
      total,
      lastPage,
      currentPage: index,
      size,
    };
  }
}