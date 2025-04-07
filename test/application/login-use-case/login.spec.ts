import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LoginUseCase } from '../../../src/application/login-use-case/login';
import { UserService } from '../../../src/domain/services/user.service';
import { GenerateJwtService } from '../../../src/domain/services/jwt/generate-jwt.service';
import { LoginDto } from '../../../src/application/login-use-case/login.dto';

describe('LoginUseCase', () => {
    let loginUseCase: LoginUseCase;
    let userModel: Model<any>;
    let userService: UserService;
    let generateJwtService: GenerateJwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginUseCase,
                {
                    provide: getModelToken('UserSchema'),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        comparePassword: jest.fn(),
                    },
                },
                {
                    provide: GenerateJwtService,
                    useValue: {
                        generateToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        loginUseCase = module.get<LoginUseCase>(LoginUseCase);
        userModel = module.get<Model<any>>(getModelToken('UserSchema'));
        userService = module.get<UserService>(UserService);
        generateJwtService = module.get<GenerateJwtService>(GenerateJwtService);
    });

    it('should log in successfully with valid credentials', async () => {
        const dto: LoginDto = {
            email: 'test@example.com',
            password: 'password123',
        };
        const mockUser = {
            _id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword',
        };

        jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(userService, 'comparePassword').mockResolvedValue(true);
        jest.spyOn(generateJwtService, 'generateToken').mockResolvedValue(
            'mocked-jwt-token',
        );

        const result = await loginUseCase.execute(dto);

        expect(result).toEqual({
            name: mockUser.name,
            email: mockUser.email,
            token: 'mocked-jwt-token',
        });
        expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
        expect(userService.comparePassword).toHaveBeenCalledWith(
            dto.password,
            mockUser.password,
        );
        expect(generateJwtService.generateToken).toHaveBeenCalledWith({
            id: mockUser._id.toString(),
        });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
        const dto: LoginDto = {
            email: 'test@example.com',
            password: 'wrongpassword',
        };

        jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

        await expect(loginUseCase.execute(dto)).rejects.toThrow(
            UnauthorizedException,
        );
        expect(userModel.findOne).toHaveBeenCalledWith({ email: dto.email });
        expect(userService.comparePassword).not.toHaveBeenCalled();
        expect(generateJwtService.generateToken).not.toHaveBeenCalled();
    });
});
