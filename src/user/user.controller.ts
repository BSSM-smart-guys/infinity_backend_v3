import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthService } from '@/auth/auth.service';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const authorize = await this.userService.login(loginUserDto);
    const token = this.authService.getJwtToken(authorize);

    console.log(token);
    return { token };
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.userService.findOne(+uid);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
