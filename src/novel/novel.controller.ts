import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NovelService } from './novel.service';
import {
  CreateNovelDto,
  FindNovelListDto,
  FindNovelListCategoryDto,
  FindNovelListViewTypeDto,
  SearchNovelListDto,
  FindNovelListUserDto,
} from '@/novel/dto';
import { Novel, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/user/get-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import CreateLikeDto from './dto/request/create-like-dto';

@ApiTags('Novel')
@Controller('novel')
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Get()
  findByViewType(
    @Query() dto: FindNovelListViewTypeDto,
  ): Promise<FindNovelListDto> {
    return this.novelService.findByViewType(dto);
  }

  @Get('category')
  findByCategory(
    @Query() dto: FindNovelListCategoryDto,
  ): Promise<FindNovelListDto> {
    return this.novelService.findByCategory(dto);
  }

  @Get('search')
  searchNovelList(@Query() dto: SearchNovelListDto): Promise<FindNovelListDto> {
    return this.novelService.searchNovel(dto);
  }

  @Get(':id')
  findById(@Param('id', new ParseIntPipe()) id: number): Promise<Novel> {
    return this.novelService.findById(id);
  }

  @Get('user/:userId')
  findByUserFeedType(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Query() dto: FindNovelListUserDto,
  ) {
    return this.novelService.findByUserFeedType(userId, dto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  createNovel(
    @Body() createNovelDto: CreateNovelDto,
    @GetUser() { uid: user_uid }: User,
  ): Promise<number> {
    return this.novelService.createNovel(user_uid, createNovelDto);
  }

  // 좋아요
  @Post('like/:novelId')
  @UseGuards(AuthGuard('jwt'))
  likeStatus(
    @Body() createLikeDto: CreateLikeDto,
    @Param('novelId', new ParseIntPipe()) novelId: number,
  ) {
    return this.novelService.likeStatus(novelId, createLikeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  deleteNovel(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.novelService.deleteNovel(id);
  }
}
