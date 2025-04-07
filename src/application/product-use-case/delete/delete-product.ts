import { InjectModel } from '@nestjs/mongoose';
import { DeleteProductInterface } from './delete-product.interface';
import { ProductSchema } from '../../../domain/entitties/product.schema';
import { Model } from 'mongoose';
import { DeleteProductResultDto } from '../../../infraestructure/api/product/delete/delete-product-result.dto';
import {
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

export class DeleteProductUseCase implements DeleteProductInterface {
    constructor(
        @InjectModel(ProductSchema.name)
        private readonly productModel: Model<ProductSchema>,
    ) {}

    async execute(id: string, userId: string): Promise<DeleteProductResultDto> {
        let product: ProductSchema | null;

        try {
            product = await this.productModel.findOneAndDelete({
                _id: id,
                userId,
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (!product) {
            throw new NotFoundException(
                'Product not found or user not authorized to delete',
            );
        }

        return {
            message: 'Product deleted successfully',
        };
    }
}
