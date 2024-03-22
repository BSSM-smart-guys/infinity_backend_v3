import config from '@/config';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

const translate = config().translate;

@Injectable()
export class TranslationService {
  async translate(text: string) {
    const headers = {
      headers: {
        Authorization: `DeepL-Auth-Key ${translate.key}`,
        'Content-Type': 'application/json',
      },
    };

    const body = {
      text: [text],
      source_lang: 'KO',
      target_lang: 'EN-US',
    };

    return await axios.post(translate.url, body, headers);
  }
}
