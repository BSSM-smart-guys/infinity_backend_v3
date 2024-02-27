import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
  saltrounds = 10;

  async create(createUserDto: CreateUserDto) {
    const { id, nickname } = createUserDto;

    const duplicate = await prisma.user.findMany({
      where: { OR: [{ id }, { nickname }] },
    });
    console.log(duplicate.length, duplicate);
    if (duplicate.length != 0) throw new ConflictException();

    const pwd = await bcrypt.hash(createUserDto.pwd, this.saltrounds);

    await prisma.user.create({
      data: { id, pwd, nickname },
    });

    return createUserDto;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
