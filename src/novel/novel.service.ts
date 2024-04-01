import { Injectable, NotFoundException } from '@nestjs/common';
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

  // 기본 조회
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

  // 카테고리별로 찾기
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

  // 검색
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

  // 상세 조회
  async findById(uid: number) {
    this.updateNovelView(uid); // view 수 올리기
    const findNovel = await this.findNovelDetailById(uid); // 소설 상세 조회
    const userResult = await this.findUserNickname(findNovel[0].user_uid); // 닉네임 가져오기
    const novelResult = await this.novelWithLikes(findNovel);

    return { userResult, novelResult };
  }

  async findByIdWithUser(uid: number, token: string) {
    const user = await this.authService.validateToken(token);
    this.updateNovelView(uid);
    const userResult = await this.findUserNickname(user.uid);
    const findNovel = await this.findNovelDetailById(uid);
    const novelResult = await this.novelWithLikes(findNovel, user); // 좋아요 여부

    return { userResult, novelResult };
  }

  async findByUserFeedType(
    userId: number,
    { userFeedType, index, size }: FindNovelListUserDto,
  ) {
    let novelList;
    if (userFeedType === UserFeedType.USER_LIKED) {
      novelList = await prisma.novel.findMany({
        include: {
          novel_likes: true,
        },
        where: {
          novel_likes: {
            some: {
              user_uid: userId,
            },
          },
        },
        orderBy: {
          uid: 'desc',
        },
        skip: (index - 1) * size,
        take: size,
      });
    } else {
      novelList = await prisma.novel.findMany({
        where: {
          user_uid: userId,
        },
        orderBy: {
          uid: 'desc',
        },
        skip: (index - 1) * size,
        take: size,
      });
    }

    const novelLikedList = novelList.map((novel) => {
      return {
        ...novel,
        novel_likes: novel.novel_likes?.length ?? 0,
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

  // --------------------분리한 함수 로직들--------------------------------------

  async updateNovelView(uid) {
    return await prisma.novel.update({
      where: {
        uid,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }
  async findNovelDetailById(uid) {
    return await prisma.novel.findMany({
      where: {
        uid,
      },
      include: {
        novel_likes: {
          where: {
            novel_uid: uid,
          },
        },
      },
    });
  }

  async novelWithLikes(novel, user = null) {
    if (user === null) {
      return novel.map((novel) => ({
        ...novel,
        likeCount: novel.novel_likes.length, // 비로그인 시 좋아요 count만
      }));
    }
    return novel.map((novel) => ({
      ...novel,
      like: novel.novel_likes.some((like) => like.user_uid === user.uid), // 로그인 시 count + 좋아요 여부도
      likeCount: novel.novel_likes.length,
    }));
  }

  async findUserNickname(uid) {
    return await prisma.user.findUnique({
      select: {
        nickname: true,
      },
      where: {
        uid,
      },
    });
  }
}
