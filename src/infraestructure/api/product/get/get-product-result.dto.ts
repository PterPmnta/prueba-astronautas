import { CreateUserResultDto } from '../../user/create-user-result.dto';

export class GetProductResultDto {
    id: string;
    name: string;
    price: number;
    user: CreateUserResultDto;
}
