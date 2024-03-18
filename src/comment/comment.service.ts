import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CommentService {
  async create(createCommentDto: CreateCommentDto, user_uid: any) {
    console.log(user_uid);
    const { novel_uid, review } = createCommentDto;
    return prisma.comment.create({
      data: {
        novel_uid,
        user_uid,
        review,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
