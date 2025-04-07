import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserUseCase } from '../../../../src/application/user-use-case/create/create-user';
import { UserService } from '../../../../src/domain/services/user.service';
import { CreateUserDto } from '../../../../src/application/user-use-case/create/create-user.dto';
import { CreateUserResultDto } from '../../../../src/infraestructure/api/user/create-user-result.dto';
import { UserSchema } from '../../../../src/domain/entitties/user.schema';

describe('CreateUserUseCase', () => {
    let createUserUseCase: CreateUserUseCase;
    let userModel: Model<UserSchema>;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserUseCase,
                {
                    provide: getModelToken(UserSchema.name),
                    useValue: {
                        create: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        hashPassword: jest.fn(),
                    },
                },
            ],
        }).compile();

        createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
        userModel = module.get<Model<UserSchema>>(
            getModelToken(UserSchema.name),
        );
        userService = module.get<UserService>(UserService);
    });

    it('should create a user successfully', async () => {
        const dto: CreateUserDto = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        const hashedPassword = 'hashedpassword123';
        const mockUser = {
            _id: '123',
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        };

        jest.spyOn(userService, 'hashPassword').mockResolvedValue(
            hashedPassword,
        );
        jest.spyOn(userModel, 'create').mockResolvedValue(mockUser as any); // 👈 importante el `as any` para el mock

        const result: CreateUserResultDto =
            await createUserUseCase.execute(dto);

        expect(result).toEqual({
            id: mockUser._id,
            name: mockUser.name,
            email: mockUser.email,
        });
        expect(userService.hashPassword).toHaveBeenCalledWith(dto.password);
        expect(userModel.create).toHaveBeenCalledWith({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });
    });

    it('should throw an error if user creation fails', async () => {
        const dto: CreateUserDto = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        jest.spyOn(userService, 'hashPassword').mockResolvedValue(
            'hashedpassword123',
        );
        jest.spyOn(userModel, 'create').mockRejectedValue(
            new Error('Database error'),
        );

        await expect(createUserUseCase.execute(dto)).rejects.toThrow(
            'Error creating user',
        );
        expect(userService.hashPassword).toHaveBeenCalledWith(dto.password);
        expect(userModel.create).toHaveBeenCalled();
    });
});
