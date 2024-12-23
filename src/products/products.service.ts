import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getAll() {
    return await this.productModel.find({});
  }

  async getOneById(id: string) {
    return await this.productModel.findById(id);
  }

  async create(dto: CreateProductDto, images: Array<Express.Multer.File>) {
    const productData = {
      ...dto,
      images: images.map((image) => `http://localhost:4500/${image.path}`),
      rating: 4,
    };
    return await this.productModel.create(productData);
  }
}
