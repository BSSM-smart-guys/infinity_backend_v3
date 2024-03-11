import { IsString } from 'class-validator';

class ImageGenerateDto {
  @IsString()
  prompt: string
}

export default ImageGenerateDto;
