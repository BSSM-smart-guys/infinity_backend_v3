import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthService } from '@/auth/auth.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Headers('Authorization') token: string,
  ) {
    const user = await this.authService.validateToken(token);
    return this.commentService.create(createCommentDto, user.uid);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
