import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import config from '@/config';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { TranslationService } from './translation.service';

const imageDirectory: string = config().image.directory;
const ext: string = config().image.ext;

@Injectable()
export class ImageService {
  private readonly openai: OpenAI;

  constructor(private readonly translationService: TranslationService) {
    this.openai = new OpenAI({
      apiKey: config().openAi.apiKey,
    });
  }

  async generateImage(prompt: string) {
    const translateRes = await this.translationService.translate(prompt);
    const translatedPrompt = translateRes.data.translations[0].text;
    const response = await this.openai.images.generate({
      model: 'dall-e-2',
      prompt: translatedPrompt,
      n: 1,
      size: '512x512',
    });
    const imageUrl = response.data[0].url;
    const fileName = this.createFileName();

    const { data } = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    return new Promise<string>((resolve, reject) => {
      fs.writeFile(imageDirectory + fileName, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('/image/' + fileName);
        }
      });
    });
  }

  private createFileName() {
    return uuidv4() + '-' + Date.now() + ext;
  }
}
