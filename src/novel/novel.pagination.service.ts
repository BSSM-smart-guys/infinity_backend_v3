import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationMetaDto } from '@/novel/dto';
import { Category } from '@/novel/enums';

const prisma = new PrismaClient();

@Injectable()
export class NovelPaginationService {
  async getMetadata(
    index: number,
    size: number,
    category?: Category,
  ): Promise<PaginationMetaDto> {
    const total: number = await prisma.novel.count(
      category && {
        where: {
          category,
        },
      },
    );
    const lastPage: number = Math.ceil(total / size);

    return {
      total,
      lastPage,
      currentPage: index,
      size,
    };
  }
}