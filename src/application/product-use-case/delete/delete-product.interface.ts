import { DeleteProductResultDto } from '../../../infraestructure/api/product/delete/delete-product-result.dto';

export interface DeleteProductInterface {
    execute(id: string, userId: string): Promise<DeleteProductResultDto>;
}
