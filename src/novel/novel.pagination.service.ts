import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationMetaDto } from '@/novel/dto';

const prisma = new PrismaClient();

type PrismaWhereType = object & Prisma.NovelWhereInput;

@Injectable()
export class NovelPaginationService {
  async getMetadata(
    index: number,
    size: number,
    where?: PrismaWhereType,
  ): Promise<PaginationMetaDto> {
    const total: number = await this.getNovelCount(where && { ...where });
    const lastPage: number = this.getLastPage(total, size);

    return {
      total,
      lastPage,
      currentPage: index,
      size,
    };
  }

  getLastPage(total: number, size: number) {
    return Math.ceil(total / size);
  }

  async getNovelCount(where: PrismaWhereType) {
    return prisma.novel.count({
      where,
    });
  }
}
