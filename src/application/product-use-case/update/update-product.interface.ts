import { UpdateProductDto } from './update-product.dto';
import { UpdateProductResultDto } from '../../../infraestructure/api/product/update/update-product-result.dto';

export interface UpdateProductInterface {
    execute(
        id: string,
        dto: UpdateProductDto,
        userId: string,
    ): Promise<UpdateProductResultDto>;
}
