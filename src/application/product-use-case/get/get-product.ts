import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GetProductByUserIdInterface } from './get-product.interface';
import { ProductSchema } from '../../../domain/entitties/product.schema';

export class GetProductByUserIdUseCase implements GetProductByUserIdInterface {
    constructor(
        @InjectModel(ProductSchema.name)
        private readonly productModel: Model<ProductSchema>,
    ) {}

    async execute(userId: string): Promise<any> {
        try {
            const products = await this.productModel
                .find({ userId })
                .populate('userId');

            if (!products) {
                throw new Error(
                    'The user do not have Products registered by this id.',
                );
            }

            return products;
        } catch (error) {
            console.error(error);
            throw new Error('Error getting products by user id.');
        }
    }
}
