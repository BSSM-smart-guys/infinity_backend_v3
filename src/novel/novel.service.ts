import { Injectable } from '@nestjs/common';
import { CreateNovelDto } from '@/novel/dto';
import { Novel, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class NovelService {
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

  async createNovel({ title, content, thumbnail, category }: CreateNovelDto) {
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
