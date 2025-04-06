import { UpdateProductDto } from './update-product.dto';
import { UpdateProductResultDto } from '../../../infraestructure/api/product/update/update-product-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateProductInterface } from './update-product.interface';
import { ProductSchema } from '../../../domain/entitties/product.schema';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class UpdateProductUseCase implements UpdateProductInterface {
    constructor(
        @InjectModel(ProductSchema.name)
        private readonly productModel: Model<ProductSchema>,
    ) {}

    async execute(
        id: string,
        dto: UpdateProductDto,
        userId: string,
    ): Promise<UpdateProductResultDto> {
        try {
            const product = await this.productModel.findOneAndUpdate(
                { _id: id, userId },
                dto,
                { new: true },
            );

            if (!product) {
                throw new Error('Product not found');
            }

            return {
                id: product._id.toString(),
                name: product.name,
                price: product.price,
            };
        } catch (error) {
            throw new BadRequestException(
                'The product could not be updated by other user that created before',
            );
        }
    }
}
