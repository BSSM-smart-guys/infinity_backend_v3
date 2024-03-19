import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ImageService } from '@/image/image.service';
import { ImageGenerateDto } from '@/image/dto/request';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '이미지 생성 API' })
  generateImage(@Body() { prompt }: ImageGenerateDto) {
    return this.imageService.generateImage(prompt);
  }
}
