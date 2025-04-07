import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LoginDto } from './login.dto';
import { LoginInterface } from './login.interface';

import { UserSchema } from '../../domain/entitties/user.schema';
import { UserService } from '../../domain/services/user.service';
import { GenerateJwtService } from '../../domain/services/jwt/generate-jwt.service';

import { CreateAuthResultDto } from '../../infraestructure/api/auth/create-auth-result';

@Injectable()
export class LoginUseCase implements LoginInterface {
    constructor(
        @InjectModel(UserSchema.name)
        private readonly userModel: Model<UserSchema>,
        private readonly userService: UserService,
        private readonly generateJwtService: GenerateJwtService,
    ) {}

    async execute(dto: LoginDto): Promise<CreateAuthResultDto> {
        try {
            const user = await this.userModel.findOne({ email: dto.email });

            if (!user) {
                throw new UnauthorizedException('Credentials are not valid');
            }

            const isPasswordValid = await this.userService.comparePassword(
                dto.password,
                user.password,
            );

            if (!isPasswordValid) {
                throw new UnauthorizedException('Credentials are not valid');
            }

            const token = await this.generateJwtService.generateToken({
                id: user._id.toString(),
            });

            return {
                name: user.name,
                email: user.email,
                token: token,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new Error(error.message);
        }
    }
}
