import { CreateProductDto } from './create-product.dto';
import { CreateProductResultDto } from '../../../infraestructure/api/product/create-product-result.dto';

export interface CreateProductInterface {
    execute(
        dto: CreateProductDto,
        userId: string,
    ): Promise<CreateProductResultDto>;
}
