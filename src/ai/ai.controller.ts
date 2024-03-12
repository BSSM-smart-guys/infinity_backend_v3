import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';

@Controller('/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}
  @Post()
  async getAIResponse(
    @Body('keyword') keyword: KeywordDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    console.log(keyword);

    const result = await this.aiService.getAI(keyword);
    for await (const chunk of result) {
      for (const char of chunk.choices[0].delta?.content || '') {
        res.write(`${char}`);
        await new Promise((resolve) => setTimeout(resolve, 10)); // 각 글자를 100ms 간격으로 전송
      }
    }
    res.end();
  }
}
