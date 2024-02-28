import { Module } from '@nestjs/common';
import { NovelModule } from './novel/novel.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NovelModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
