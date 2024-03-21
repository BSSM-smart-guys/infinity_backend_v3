import { Injectable } from '@nestjs/common';
import {
  CreateNovelDto,
  FindNovelListCategoryDto,
  FindNovelListDto,
  FindNovelListUserDto,
  FindNovelListViewTypeDto,
  SearchNovelListDto,
} from '@/novel/dto';
import { Novel, PrismaClient } from '@prisma/client';
import { UserFeedType, ViewType } from '@/novel/enums';
import { NovelPaginationService } from '@/novel/novel.pagination.service';
import CreateLikeDto from './dto/request/create-like-dto';
import { AuthService } from '@/auth/auth.service';

const prisma = new PrismaClient();

@Injectable()
export class NovelService {
  constructor(
    private readonly novelPaginationService: NovelPaginationService,
    private readonly authService: AuthService,
  ) {}
  async findByIdWithUser(uid: number, token: string) {
    const user = await this.authService.validateToken(token);
    const novelsWithUserLike = await prisma.novel.findMany({
      where: {
        uid,
      },
      include: {
        novel_likes: {
          where: {
            user_uid: user.uid,
          },
        },
      },
    });

    await prisma.novel.update({
      where: {
        uid,
      },
      data: {
        views: novelsWithUserLike[0].views + 1,
      },
    });

    const novelResult = novelsWithUserLike.map((novel) => ({
      ...novel,
      like: novel.novel_likes.some((like) => like.user_uid === user.uid),
      likeCount: novel.novel_likes.length,
    }));

    return { user, novelResult };
  }

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
      include: {
        novel_likes: {
          where: {
            novel_uid: id,
          },
        },
      },
    });
  }

  async findByUserFeedType(
    userId: number,
    { userFeedType, index, size }: FindNovelListUserDto,
  ) {
    const novelList = await prisma.novel.findMany({
      ...(userFeedType === UserFeedType.USER_LIKED && {
        include: {
          novel_likes: true,
        },
      }),
      where: {
        user_uid: userId,
      },
      orderBy: {
        uid: 'desc',
      },
      skip: (index - 1) * size,
      take: size,
    });

    const novelLikedList = novelList.map((novel) => {
      return {
        ...novel,
        novel_likes: novel.novel_likes.length,
      };
    });

    return {
      data: novelLikedList,
      meta: await this.novelPaginationService.getMetadata(
        index,
        size,
        null,
        null,
        userId,
      ),
    };
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

  async likeStatus(novel_uid: number, createLikeDto: CreateLikeDto) {
    const { user_uid } = createLikeDto;

    const likeCheck = await prisma.novel_Like.findMany({
      where: {
        user_uid,
        novel_uid,
      },
    });

    if (likeCheck.length == 0) {
      return await prisma.novel_Like.create({
        data: { novel_uid, user_uid },
      });
    }
    return await prisma.novel_Like.delete({
      where: {
        user_uid_novel_uid: {
          user_uid,
          novel_uid,
        },
      },
    });
  }
}
