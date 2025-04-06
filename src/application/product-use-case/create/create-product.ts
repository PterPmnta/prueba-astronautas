import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from './create-product.dto';
import { CreateProductInterface } from './create-product.interface';
import { ProductSchema } from '../../../domain/entitties/product.schema';
import { CreateProductResultDto } from '../../../infraestructure/api/product/create/create-product-result.dto';
import { UserSchema } from '../../../domain/entitties/user.schema';

export class CreateProductUseCase implements CreateProductInterface {
    constructor(
        @InjectModel(ProductSchema.name)
        private readonly productModel: Model<ProductSchema>,
        @InjectModel(UserSchema.name)
        private readonly userModel: Model<UserSchema>,
    ) {}

    async execute(
        dto: CreateProductDto,
        userId: string,
    ): Promise<CreateProductResultDto> {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const productToSave = {
                ...dto,
                userId: user._id,
            };

            const product = await this.productModel.create(productToSave);
            return {
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                userId: product.userId.toString(),
            };
        } catch (error) {
            throw new Error('Error creating product');
        }
    }
}
