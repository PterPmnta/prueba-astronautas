import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductUseCase } from '../../../../src/application/product-use-case/create/create-product';
import { ProductSchema } from '../../../../src/domain/entitties/product.schema';
import { UserSchema } from '../../../../src/domain/entitties/user.schema';
import { CreateProductDto } from '../../../../src/application/product-use-case/create/create-product.dto';
import { CreateProductResultDto } from '../../../../src/infraestructure/api/product/create/create-product-result.dto';

describe('CreateProductUseCase', () => {
    let useCase: CreateProductUseCase;
    let productModel: Model<ProductSchema>;
    let userModel: Model<UserSchema>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateProductUseCase,
                {
                    provide: getModelToken(ProductSchema.name),
                    useValue: {
                        create: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(UserSchema.name),
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
        productModel = module.get(getModelToken(ProductSchema.name));
        userModel = module.get(getModelToken(UserSchema.name));
    });

    it('should create a product successfully', async () => {
        const dto: CreateProductDto = {
            name: 'Test Product',
            price: 1000,
        };

        const mockUserId = 'user-id-123';
        const mockUser = { _id: mockUserId };
        const mockProduct = {
            _id: 'product-id-456',
            name: dto.name,
            price: dto.price,
            userId: mockUserId,
        };

        jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);
        jest.spyOn(productModel, 'create').mockResolvedValue(
            mockProduct as any,
        );

        const result: CreateProductResultDto = await useCase.execute(
            dto,
            mockUserId,
        );

        expect(result).toEqual({
            id: mockProduct._id,
            name: mockProduct.name,
            price: mockProduct.price,
            userId: mockUserId,
        });

        expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
        expect(productModel.create).toHaveBeenCalledWith({
            ...dto,
            userId: mockUser._id,
        });
    });

    it('should throw error if user is not found', async () => {
        const dto: CreateProductDto = {
            name: 'Test Product',
            price: 1000,
        };

        jest.spyOn(userModel, 'findById').mockResolvedValue(null);

        await expect(useCase.execute(dto, 'nonexistent-user')).rejects.toThrow(
            'Error creating product',
        );
    });

    it('should throw error on create failure', async () => {
        const dto: CreateProductDto = {
            name: 'Test Product',
            price: 1000,
        };

        const mockUserId = 'user-id-123';
        const mockUser = { _id: mockUserId };

        jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);
        jest.spyOn(productModel, 'create').mockRejectedValue(
            new Error('Database error'),
        );

        await expect(useCase.execute(dto, mockUserId)).rejects.toThrow(
            'Error creating product',
        );
    });
});
