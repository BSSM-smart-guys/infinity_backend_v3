import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const { id, nickname } = createUserDto;
    const saltrounds = 10;

    const duplicate = await prisma.user.findMany({
      where: { OR: [{ id }, { nickname }] }, // id, nickname 중 중복되는 것 찾기
    });
    if (duplicate.length != 0) throw new ConflictException(); // 중복되면 conflict

    const pwd = await bcrypt.hash(createUserDto.pwd, saltrounds);

    await prisma.user.create({
      data: { id, pwd, nickname },
    });

    return createUserDto;
  }

  async login(loginUserDto: LoginUserDto) {
    const { id, pwd } = loginUserDto;

    const userInfo = await prisma.user.findMany({ where: { id } });
    const pwdCompare = await bcrypt.compare(pwd, userInfo[0].pwd);

    if (pwdCompare) return true;
    throw new UnauthorizedException();
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
