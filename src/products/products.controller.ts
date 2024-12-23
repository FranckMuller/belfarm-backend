import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'src/files/file-storage';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      storage: fileStorage,
    }),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.productsService.create(dto, images);
  }

  @Get('/trending')
  getTrending() {
    return this.productsService.getAll();
  }

  @Get(':id')
  getOneById(@Param('id') id: string) {
    console.log('get by id', id);
    return this.productsService.getOneById(id);
  }

  @Get()
  getAll() {
    console.log('getAll');
    return this.productsService.getAll();
  }
}
