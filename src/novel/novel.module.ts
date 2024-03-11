import { Module } from '@nestjs/common';
import { NovelService } from './novel.service';
import { NovelController } from './novel.controller';
import { NovelPaginationService } from '@/novel/novel.pagination.service';

@Module({
  imports: [NovelModule],
  controllers: [NovelController],
  providers: [NovelService, NovelPaginationService],
})
export class NovelModule {}
