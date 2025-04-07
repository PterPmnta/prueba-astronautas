import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GetProductByUserIdInterface } from './get-product.interface';
import { ProductSchema } from '../../../domain/entitties/product.schema';
import { GetProductResultDto } from '../../../infraestructure/api/product/get/get-product-result.dto';

export class GetProductByUserIdUseCase implements GetProductByUserIdInterface {
    constructor(
        @InjectModel(ProductSchema.name)
        private readonly productModel: Model<ProductSchema>,
    ) {}

    async execute(userId: string): Promise<GetProductResultDto[]> {
        try {
            const products = await this.productModel
                .find({ userId })
                .populate('userId');

            if (!products) {
                throw new Error(
                    'The user do not have Products registered by this id.',
                );
            }

            return products.map((product) => {
                const user = product.userId as any;

                return {
                    id: product._id.toString(),
                    name: product.name,
                    price: product.price,
                    user: {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    },
                };
            });
        } catch (error) {
            throw new Error('Error getting products by user id.');
        }
    }
}
