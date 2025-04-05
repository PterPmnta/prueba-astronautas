import { CreateUserDto } from './create-user.dto';
import { CreateUserResultDto } from '../../../infraestructure/api/user/create-user-result.dto';

export interface CreateUserInterface {
    execute(dto: CreateUserDto): Promise<CreateUserResultDto>;
}
