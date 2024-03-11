import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import OpenAI from 'openai';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import config from '@/config';

const imageDirectory: string = config().image.directory;

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [
    OpenAI,
    ServeStaticModule.forRoot({
      rootPath: join(imageDirectory),
      serveRoot: '/image',
    }),
  ],
})
export class ImageModule {}
