import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

import { UserController } from './infraestructure/api/user/user.controller';
import { CreateUserUseCase } from './application/user-use-case/create/create-user';

import { UserSchema, UserSchemaFactory } from './domain/entitties/user.schema';
import { UserService } from './domain/services/user.service';

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
        ]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: 'CreateUserInterface',
            useClass: CreateUserUseCase,
        },
    ],
})
export class AppModule {}
