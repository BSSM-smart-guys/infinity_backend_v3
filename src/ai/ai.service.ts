import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

@Injectable()
export class AiService {
  async getAI(keyword: KeywordDto) {
    const { characters, events, backgrounds } = keyword;
    console.log(keyword);
    return openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a novelist.' },
        {
          role: 'user',
          content: `write only novel in Korean with this keywords - characters:[${characters}], events: [${events}], backgrounds: [${backgrounds}]. Don't say anything except about novel, Don't write a title. `,
        },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
    });
  }
}
