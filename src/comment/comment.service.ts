import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CommentService {
  async create(createCommentDto: CreateCommentDto, user_uid: any) {
    const { novel_uid, review } = createCommentDto;
    return await prisma.comment.create({
      data: {
        novel_uid,
        user_uid,
        review,
      },
    });
  }

  async findOne(novel_uid: number) {
    return await prisma.comment.findMany({
      include: {
        user: {
          select: {
            uid: true,
            nickname: true,
          },
        },
      },
      where: {
        novel_uid,
      },
    });
  }

  update(uid: number, review: object) {
    return prisma.comment.update({
      where: {
        uid,
      },
      data: review,
    });
  }

  remove(uid: number) {
    return prisma.comment.delete({
      where: { uid },
    });
  }
}
