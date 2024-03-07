import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.APIKEY,
});

@Injectable()
export class AiService {
  async getAI(keyword) {
    return openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a novelist.' },
        {
          role: 'user',
          content: `write just a novel in Korean with this keywords: ${keyword}, Don't say anything except about novel, Don't write a title. `,
        }, // 엔지니어링 나중에 인물 사건 배경으로 다시 해야됨ㅇㅇ
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
    });
  }
}
