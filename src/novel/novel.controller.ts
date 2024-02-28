import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { NovelService } from './novel.service';
import { CreateNovelDto } from '@/novel/dto';

@Controller('novel')
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Post()
  @HttpCode(201)
  createNovel(@Body() createNovelDto: CreateNovelDto) {
    return this.novelService.createNovel(createNovelDto);
  }
}
