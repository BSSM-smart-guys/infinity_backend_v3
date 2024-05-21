import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/user/get-user.decorator';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import CreateLikeDto from './dto/request/create-like-dto';
import { Category, UserFeedType, ViewType } from '@/novel/enums';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Novel')
@SkipThrottle()
@Controller('novel')
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Get()
  @ApiOperation({ summary: '최신순과 인기순으로 소설 조회' })
  @ApiQuery({
    name: 'viewType',
    enum: ViewType,
  })
  @ApiQuery({
    name: 'index',
    type: 'number',
    description: '페이지 번호 (1부터 시작)',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '한 페이지에 들어가는 소설 개수',
  })
  findByViewType(
    @Query() dto: FindNovelListViewTypeDto,
  ): Promise<FindNovelListDto> {
    return this.novelService.findByViewType(dto);
  }

  @Get('category')
  @ApiOperation({ summary: '카테고리별 소설 조회' })
  @ApiQuery({
    name: 'category',
    enum: Category,
  })
  @ApiQuery({
    name: 'index',
    type: 'number',
    description: '페이지 번호 (1부터 시작)',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '한 페이지에 들어가는 소설 개수',
  })
  findByCategory(
    @Query() dto: FindNovelListCategoryDto,
  ): Promise<FindNovelListDto> {
    return this.novelService.findByCategory(dto);
  }

  @Get('search')
  @ApiOperation({ summary: '소설 검색' })
  @ApiQuery({
    name: 'viewType',
    enum: ViewType,
  })
  @ApiQuery({
    name: 'index',
    type: 'number',
    description: '페이지 번호 (1부터 시작)',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '한 페이지에 들어가는 소설 개수',
  })
  @ApiQuery({
    name: 'query',
    type: 'string',
    description: '검색어',
  })
  searchNovelList(@Query() dto: SearchNovelListDto): Promise<FindNovelListDto> {
    return this.novelService.searchNovel(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '소설 상세 조회' })
  findById(
    @Param('id', new ParseIntPipe()) id: number,
    @Headers('Authorization') token: string = null,
  ): Promise<any> {
    return this.novelService.findById(id, token);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '특정 유저의 피드 조회' })
  @ApiQuery({
    name: 'userFeedType',
    enum: UserFeedType,
  })
  @ApiQuery({
    name: 'index',
    type: 'number',
    description: '페이지 번호 (1부터 시작)',
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    description: '한 페이지에 들어가는 소설 개수',
  })
  findByUserFeedType(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Query() dto: FindNovelListUserDto,
  ) {
    return this.novelService.findByUserFeedType(userId, dto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiOperation({ summary: '소설 추가' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
        category: {
          type: 'string',
          required: [
            Category.FANTASY,
            Category.DAILY,
            Category.FEATURE,
            Category.ROMANCE,
            Category.THRILLER,
            Category.ETC,
          ],
          description: '하나면 선택해서 문자열로 보내면 됨',
        },
        content: {
          type: 'string',
        },
      },
    },
  })
  createNovel(
    @Body() createNovelDto: CreateNovelDto,
    @GetUser() { uid: user_uid }: User,
  ): Promise<number> {
    return this.novelService.createNovel(user_uid, createNovelDto);
  }

  // 좋아요
  @ApiOperation({ summary: '좋아요' })
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
  @ApiOperation({ summary: '소설 삭제' })
  deleteNovel(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.novelService.deleteNovel(id);
  }
}
