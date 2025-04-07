import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserInterface } from './create-user.interface';
import { UserSchema } from '../../../domain/entitties/user.schema';
import { CreateUserDto } from './create-user.dto';
import { CreateUserResultDto } from '../../../infraestructure/api/user/create-user-result.dto';
import { UserService } from '../../../domain/services/user.service';

@Injectable()
export class CreateUserUseCase implements CreateUserInterface {
    constructor(
        @InjectModel(UserSchema.name)
        private readonly userModel: Model<UserSchema>,
        private readonly userService: UserService,
    ) {}

    async execute(dto: CreateUserDto): Promise<CreateUserResultDto> {
        try {
            const { password, ...userData } = dto;
            const userToSave = {
                ...userData,
                password: await this.userService.hashPassword(password),
            };
            const user = await this.userModel.create(userToSave);
            return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            throw new Error('Error creating user');
        }
    }
}
