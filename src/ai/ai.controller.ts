import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { KeywordDto } from './dto/keywordDto';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('AI')
@Controller('/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiOperation({ summary: '소설 작성 API' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async getAIResponse(@Body() body, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const keyword: KeywordDto = body.keyword;
    const result = await this.aiService.getAI(keyword);
    for await (const chunk of result) {
      for (const char of chunk.choices[0].delta?.content || '') {
        res.write(`${char}`);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
    res.end();
  }
}
