import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  Put,
  Headers,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthService } from '@/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
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

    return { token };
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.userService.findOne(+uid);
  }

  @Get('/')
  findByJWT(@Headers('Authorization') token: string) {
    const [Bearer, JWT] = token.split(' ');
    return this.authService.validateToken(JWT);
  }
  @Put(':uid')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    this.userService.update(+uid, updateUserDto);
    return HttpStatus.OK;
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {   // 프론트랑 상의 후 개발
  //   return this.userService.remove(+id);
  // }
}
