import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserResultDto } from './create-user-result.dto';
import { CreateUserDto } from '../../../application/user-use-case/create/create-user.dto';
import { CreateUserInterface } from '../../../application/user-use-case/create/create-user.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        @Inject('CreateUserInterface')
        private readonly createUserUseCase: CreateUserInterface,
    ) {}

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResultDto> {
        return this.createUserUseCase.execute(dto);
    }
}
