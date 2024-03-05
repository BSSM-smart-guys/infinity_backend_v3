import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  //constructor(private readonly authService: AuthService) {}

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
    if (!userInfo) throw new NotFoundException();

    const pwdCompare = await bcrypt.compare(pwd, userInfo[0].pwd);

    if (pwdCompare) {
      //  const payload = { id: userInfo[0].id, nickname: userInfo[0].nickname };
      return userInfo[0].uid;
    }
    throw new UnauthorizedException();
  }

  async findOne(uid: number) {
    const userInfo = await prisma.user.findUnique({
      select: { id: true, nickname: true },
      where: { uid },
    });
    if (!userInfo) throw new NotFoundException();
    return userInfo;
  }

  async update(uid: number, updateUserDto: UpdateUserDto) {
    return await prisma.user.update({ where: { uid }, data: updateUserDto });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
