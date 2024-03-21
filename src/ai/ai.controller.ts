import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { KeywordDto } from './dto/keywordDto';

@ApiTags('AI')
@Controller('/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiOperation({ summary: '소설 작성 API' })
  @Post()
  async getAIResponse(
    @Body() body: any,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const keyword: KeywordDto = body.keyword;
    // console.log(keyword);

    const result = await this.aiService.getAI(keyword);
    for await (const chunk of result) {
      for (const char of chunk.choices[0].delta?.content || '') {
        res.write(`${char}`);
        await new Promise((resolve) => setTimeout(resolve, 10)); // 각 글자를 10ms 간격으로 전송
      }
    }
    res.end();
  }
}
