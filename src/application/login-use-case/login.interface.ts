import { CreateAuthResultDto } from 'src/infraestructure/api/auth/create-auth-result';
import { LoginDto } from './login.dto';

export interface LoginInterface {
    execute(dto: LoginDto): Promise<CreateAuthResultDto>;
}
