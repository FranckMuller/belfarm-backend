import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'src/files/file-storage';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAll() {
    return this.categoriesService.getAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: fileStorage,
    }),
  )
  create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.categoriesService.create(dto, image);
  }
}
