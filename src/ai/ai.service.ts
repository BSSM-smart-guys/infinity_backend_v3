import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { KeywordDto } from './dto/keywordDto';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

@Injectable()
export class AiService {
  async getAI(keyword: KeywordDto) {
    const { characters, events, backgrounds } = keyword;
    return openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a novelist.' },
        {
          role: 'user',
          content: `Write a novel in korean with the following keyword. Character: [${characters !== '' ? `${characters}` : 'Undefined'}], Plot: [${events !== '' ? `${events}` : 'Undefined'}], Setting: [${backgrounds !== '' ? `${backgrounds}` : 'Undefined'}]. Include the lines of the characters. And the lines separate the sentences. Talk only about the novel, and don't write down the title and explanation. Write a story with a closed ending and write down more than 2,000 characters.`,
          // 자꾸 괄호 써서 폐기 => content: `write only novel in Korean with this keywords - characters:[${characters}], events: [${events}], backgrounds: [${backgrounds}]. Don't say anything except about novel, Don't write a title, write in between 1500 ~ 2500 characters.`,
          // 한글로 작성하면 프롬프트 질이 안 좋아서 폐기 => content: `다음 키워드로 소설을 써줘. 인물:[${characters !== "" ? `${characters}` : "정해지지 않음"}], 사건: [${events !== "" ? `${events}` : "정해지지 않음"}], 배경: [${backgrounds !== "" ? `${backgrounds}` : "정해지지 않음"}]. 인물들의 대사도 포함해줘. 그리고 대사는 문장을 분리해줘. 소설 내용만 얘기하고, 제목이랑 설명글은 적지 마. 닫힌 결말로 이야기를 짓고 2000자 이상 적어줘.`
        },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
    });
  }
}
