import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '게시판 내 댓글 가져오기' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @ApiOperation({ summary: '댓글 작성하기' })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Headers('Authorization') token: string,
  ) {
    const user = await this.authService.validateToken(token);
    return this.commentService.create(createCommentDto, user.uid);
  }

  @ApiOperation({ summary: '댓글 수정하기' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() review: object) {
    return this.commentService.update(+id, review);
  }

  @ApiOperation({ summary: '댓글 삭제하기' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number) {
    return this.commentService.remove(+id);
  }
}
