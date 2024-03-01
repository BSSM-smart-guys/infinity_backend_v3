import { Injectable } from '@nestjs/common';
import { CreateNovelDto, PaginationMetaDto } from '@/novel/dto';
import { Novel, PrismaClient } from '@prisma/client';
import { Category, ViewType } from '@/novel/enums';
import { NovelPaginationService } from '@/novel/novel.pagination.service';

const prisma = new PrismaClient();

@Injectable()
export class NovelService {
  constructor(
    private readonly novelPaginationService: NovelPaginationService,
  ) {}

  async findByViewType(
    viewType: ViewType,
    index: number,
    size: number,
  ): Promise<{ data: Novel[]; meta: PaginationMetaDto }> {
    let condition;
    if (viewType === ViewType.LATEST) {
      condition = { uid: 'desc' };
    } else if (viewType === ViewType.POPULAR) {
      condition = [{ views: 'desc' }, { uid: 'desc' }];
    }

    return {
      data: await prisma.novel.findMany({
        orderBy: condition,
        skip: (index - 1) * size,
        take: size,
      }),
      meta: await this.novelPaginationService.getMetadata(index, size),
    };
  }

  async findByCategory(category: Category, index: number, size: number) {
    return {
      data: await prisma.novel.findMany({
        where: {
          category,
        },
        skip: (index - 1) * size,
        take: size,
      }),
      meta: await this.novelPaginationService.getMetadata(
        index,
        size,
        category,
      ),
    };
  }

  async findById(id: number): Promise<Novel> {
    const novel = await prisma.novel.findUnique({
      where: {
        uid: id,
      },
    });

    return prisma.novel.update({
      where: {
        uid: id,
      },
      data: {
        views: novel.views + 1,
      },
    });
  }

  async createNovel({
    title,
    content,
    thumbnail,
    category,
  }: CreateNovelDto): Promise<number> {
    return (
      await prisma.novel.create({
        data: {
          user_uid: 1,
          title,
          content,
          thumbnail,
          category,
          views: 0,
        },
      })
    ).uid;
  }
}
