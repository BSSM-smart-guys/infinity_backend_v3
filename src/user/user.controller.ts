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
import { CreateUserDto } from './dto/request/create-user.dto';
import { LoginUserDto } from './dto/request/login-user-dto';
import { AuthService } from '@/auth/auth.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { ValidateTokenResponseDto } from './dto/response/validate-token-response.dto';
import { User } from '@prisma/client';
import { userInfoDto } from './dto/response/userInfo-dto';

type UserWithOutPwd = Omit<User, 'pwd'>;

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
  findByJWT(
    @Headers('Authorization') token: string,
  ): Promise<ValidateTokenResponseDto> {
    return this.authService.validateTokenResponseWithInfo(token);
  }

  @ApiOperation({ summary: '유저 정보 by JWT API' })
  @Get('/onlyuser')
  findJustUserByJWT(
    @Headers('Authorization') token: string,
  ): Promise<UserWithOutPwd> {
    return this.authService.validateToken(token);
  }

  @ApiOperation({ summary: '유저 회원가입 API' })
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto): Promise<userInfoDto> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '유저 로그인 API' })
  @HttpCode(200)
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokenResponseDto> {
    const authorize = await this.userService.login(loginUserDto);
    const token = this.authService.createToken(authorize);
    return TokenResponseDto.of(token);
  }

  @ApiOperation({ summary: '유저 정보 수정 API' })
  @Put(':uid')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): HttpStatus {
    this.userService.update(+uid, updateUserDto);
    return HttpStatus.OK;
  }
}
