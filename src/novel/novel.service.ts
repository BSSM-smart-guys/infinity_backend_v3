import { Injectable } from '@nestjs/common';
import { CreateNovelDto } from '@/novel/dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class NovelService {
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
