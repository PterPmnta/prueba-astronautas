import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateAuthResultDto } from './create-auth-result';
import { LoginDto } from '../../../application/login-use-case/login.dto';
import { LoginInterface } from '../../../application/login-use-case/login.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject('LoginInterface')
        private readonly loginUseCase: LoginInterface,
    ) {}

    @Post()
    async login(@Body() dto: LoginDto): Promise<CreateAuthResultDto> {
        return this.loginUseCase.execute(dto);
    }
}
