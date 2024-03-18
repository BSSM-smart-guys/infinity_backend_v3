import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ImageService } from '@/image/image.service';
import { ImageGenerateDto } from '@/image/dto/request';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  generateImage(@Body() { prompt }: ImageGenerateDto) {
    return this.imageService.generateImage(prompt);
  }
}
