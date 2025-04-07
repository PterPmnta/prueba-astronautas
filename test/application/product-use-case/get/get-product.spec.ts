import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetProductByUserIdUseCase } from '../../../../src/application/product-use-case/get/get-product';
import { ProductSchema } from '../../../../src/domain/entitties/product.schema';

describe('GetProductByUserIdUseCase', () => {
    let useCase: GetProductByUserIdUseCase;
    let productModel: Model<any>;

    const mockProducts = [
        {
            _id: 'product123',
            name: 'Producto 1',
            price: 1000,
            userId: {
                _id: 'user456',
                name: 'Juan Pérez',
                email: 'juan@mail.com',
            },
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetProductByUserIdUseCase,
                {
                    provide: getModelToken(ProductSchema.name),
                    useValue: {
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get(GetProductByUserIdUseCase);
        productModel = module.get(getModelToken(ProductSchema.name));
    });

    it('should return products by user id with populated user', async () => {
        jest.spyOn(productModel, 'find').mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce(mockProducts),
        } as any);

        const result = await useCase.execute('user456');

        expect(result).toEqual([
            {
                id: 'product123',
                name: 'Producto 1',
                price: 1000,
                user: {
                    id: 'user456',
                    name: 'Juan Pérez',
                    email: 'juan@mail.com',
                },
            },
        ]);
    });

    it('should throw if no products found', async () => {
        jest.spyOn(productModel, 'find').mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce(null),
        } as any);

        await expect(useCase.execute('user456')).rejects.toThrow(
            'The user do not have Products registered by this id.',
        );
    });

    it('should throw an error if an exception occurs', async () => {
        jest.spyOn(productModel, 'find').mockImplementationOnce(() => {
            throw new Error('DB error');
        });

        await expect(useCase.execute('user456')).rejects.toThrow(
            'Error getting products by user id.',
        );
    });
});
