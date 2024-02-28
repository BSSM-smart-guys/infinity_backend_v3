import { Module } from '@nestjs/common';
import { NovelService } from './novel.service';
import { NovelController } from './novel.controller';

@Module({
  imports: [NovelModule],
  controllers: [NovelController],
  providers: [NovelService],
})
export class NovelModule {}
