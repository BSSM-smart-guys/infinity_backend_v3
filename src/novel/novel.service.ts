import { Injectable } from '@nestjs/common';
import {
  CreateNovelDto,
  FindNovelListCategoryDto,
  FindNovelListDto,
  FindNovelListViewTypeDto,
  SearchNovelListDto,
} from '@/novel/dto';
import { Novel, PrismaClient } from '@prisma/client';
import { ViewType } from '@/novel/enums';
import { NovelPaginationService } from '@/novel/novel.pagination.service';

const prisma = new PrismaClient();

@Injectable()
export class NovelService {
  constructor(
    private readonly novelPaginationService: NovelPaginationService,
  ) {}

  async findByViewType({
    viewType,
    index,
    size,
  }: FindNovelListViewTypeDto): Promise<FindNovelListDto> {
    return {
      data: await prisma.novel.findMany({
        orderBy: this.orderByViewType(viewType),
        skip: (index - 1) * size,
        take: size,
      }),
      meta: await this.novelPaginationService.getMetadata(index, size),
    };
  }

  async findByCategory({
    category,
    index,
    size,
  }: FindNovelListCategoryDto): Promise<FindNovelListDto> {
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

  async searchNovel({
    query,
    index,
    size,
    viewType,
  }: SearchNovelListDto): Promise<FindNovelListDto> {
    return {
      data: await prisma.novel.findMany({
        where: {
          title: {
            contains: query,
          },
        },
        orderBy: this.orderByViewType(viewType),
      }),
      meta: await this.novelPaginationService.getMetadata(
        index,
        size,
        null,
        query,
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

  async createNovel(
    user_uid: number,
    { title, content, thumbnail, category }: CreateNovelDto,
  ): Promise<number> {
    return (
      await prisma.novel.create({
        data: {
          user_uid,
          title,
          content,
          thumbnail,
          category,
          views: 0,
        },
      })
    ).uid;
  }

  async deleteNovel(id: number): Promise<void> {
    await prisma.novel.delete({
      where: {
        uid: id,
      },
    });
  }

  private orderByViewType(viewType: ViewType): any {
    if (viewType === ViewType.LATEST) {
      return { uid: 'desc' };
    } else if (viewType === ViewType.POPULAR) {
      return [{ views: 'desc' }, { uid: 'desc' }];
    }
  }
}
