import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/request/login-user-dto';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const { id, nickname } = createUserDto;
    const saltrounds = 10;

    const duplicate = await prisma.user.findMany({
      where: { OR: [{ id }, { nickname }] },
    });

    if (duplicate.length != 0) throw new ConflictException();

    const pwd = await bcrypt.hash(createUserDto.pwd, saltrounds);
    await prisma.user.create({
      data: { id, pwd, nickname },
    });

    return createUserDto;
  }

  async login(loginUserDto: LoginUserDto): Promise<number> {
    const { id, pwd } = loginUserDto;

    const userInfo = await prisma.user.findMany({ where: { id } });
    if (userInfo.length == 0) throw new NotFoundException();

    const pwdCompare = await bcrypt.compare(pwd, userInfo[0].pwd);
    if (pwdCompare) {
      return userInfo[0].uid;
    }
    throw new UnauthorizedException();
  }

  async findOne(uid: number): Promise<User> {
    const userInfo = await prisma.user.findUnique({
      select: { id: true, nickname: true },
      where: { uid },
    });
    if (!userInfo) throw new NotFoundException();

    return userInfo as User;
  }

  async update(uid: number, updateUserDto: UpdateUserDto) {
    return await prisma.user.update({ where: { uid }, data: updateUserDto });
  }
}
