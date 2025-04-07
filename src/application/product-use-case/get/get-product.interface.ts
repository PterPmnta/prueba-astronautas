import { GetProductResultDto } from '../../../infraestructure/api/product/get/get-product-result.dto';
export interface GetProductByUserIdInterface {
    execute(userId: string): Promise<GetProductResultDto[]>;
}
