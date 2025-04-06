import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
dotenv.config();

import { UserController } from './infraestructure/api/user/user.controller';
import { AuthController } from './infraestructure/api/auth/auth.controller';

import { LoginUseCase } from './application/login-use-case/login';
import { CreateUserUseCase } from './application/user-use-case/create/create-user';

import { UserSchema, UserSchemaFactory } from './domain/entitties/user.schema';
import { UserService } from './domain/services/user.service';
import { GenerateJwtService } from './domain/services/jwt/generate-jwt.service';
import {
    ProductSchema,
    ProductSchemaFactory,
} from './domain/entitties/product.schema';
import { JwtStrategy } from './domain/strategies/jwt.strategy';
import { ProductController } from './infraestructure/api/product/product.controller';
import { CreateProductUseCase } from './application/product-use-case/create/create-product';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: `mongodb://${configService.get<string>('DB_USER')}:${configService.get<string>('DB_PASSWORD')}@${configService.get<string>('DB_HOST')}:${configService.get<number>('DB_PORT')}/${configService.get<string>('DB_NAME')}?authSource=admin`,
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: UserSchema.name, schema: UserSchemaFactory },
            { name: ProductSchema.name, schema: ProductSchemaFactory },
        ]),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '24h' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UserController, AuthController, ProductController],
    providers: [
        UserService,
        GenerateJwtService,
        JwtStrategy,
        {
            provide: 'CreateUserInterface',
            useClass: CreateUserUseCase,
        },
        {
            provide: 'LoginInterface',
            useClass: LoginUseCase,
        },
        {
            provide: 'CreateProductInterface',
            useClass: CreateProductUseCase,
        },
    ],
})
export class AppModule {}
