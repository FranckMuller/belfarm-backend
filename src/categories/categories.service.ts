import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoriesModel: Model<Category>,
  ) {}

  async getAll() {
    return await this.categoriesModel.find({});
  }

  async create(dto: CreateCategoryDto, image: Express.Multer.File) {
    return await this.categoriesModel.create({
      name: dto.name,
      label: dto.label,
      image: `http://localhost:4500/${image.path}`,
    });
  }
}
