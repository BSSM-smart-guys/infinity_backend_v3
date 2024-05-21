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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthService } from '@/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('User')
@SkipThrottle()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '유저 정보 + 각종 정보 by JWT API' })
  @Get('/')
  findByJWT(@Headers('Authorization') token: string) {
    return this.authService.validateTokenResponseWithInfo(token);
  }

  @ApiOperation({ summary: '유저 정보 by JWT API' })
  @Get('/onlyuser')
  findJustUserByJWT(@Headers('Authorization') token: string) {
    return this.authService.validateToken(token);
  }

  @ApiOperation({ summary: '유저 회원가입 API' })
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '유저 로그인 API' })
  @HttpCode(200)
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const authorize = await this.userService.login(loginUserDto);
    const token = this.authService.createToken(authorize);
    return { token };
  }

  @ApiOperation({ summary: '유저 정보 수정 API' })
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
