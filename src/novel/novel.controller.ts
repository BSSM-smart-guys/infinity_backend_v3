import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NovelService } from './novel.service';
import { CreateNovelDto } from '@/novel/dto';
import { Novel } from '@prisma/client';

@Controller('novel')
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Get(':id')
  findById(@Param('id', new ParseIntPipe()) id: number): Promise<Novel> {
    return this.novelService.findById(id);
  }

  @Post()
  @HttpCode(201)
  createNovel(@Body() createNovelDto: CreateNovelDto) {
    return this.novelService.createNovel(createNovelDto);
  }
}
