import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ImageService } from '@/image/image.service';
import { ImageGenerateDto } from '@/image/dto/request';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  generateImage(@Body() { prompt }: ImageGenerateDto) {
    return this.imageService.generateImage(prompt);
  }
}
