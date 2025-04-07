import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteProductUseCase } from '../../../../src/application/product-use-case/delete/delete-product';
import { ProductSchema } from '../../../../src/domain/entitties/product.schema';
import {
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';

describe('DeleteProductUseCase', () => {
    let useCase: DeleteProductUseCase;
    let productModel: Model<ProductSchema>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeleteProductUseCase,
                {
                    provide: getModelToken(ProductSchema.name),
                    useValue: {
                        findOneAndDelete: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
        productModel = module.get<Model<ProductSchema>>(
            getModelToken(ProductSchema.name),
        );
    });

    it('should delete a product successfully', async () => {
        const mockProduct = {
            _id: 'product123',
            userId: 'user123',
        };

        jest.spyOn(productModel, 'findOneAndDelete').mockResolvedValue(
            mockProduct as any,
        );

        const result = await useCase.execute('product123', 'user123');

        expect(productModel.findOneAndDelete).toHaveBeenCalledWith({
            _id: 'product123',
            userId: 'user123',
        });
        expect(result).toEqual({
            message: 'Product deleted successfully',
        });
    });

    it('should throw NotFoundException if product not found or user unauthorized', async () => {
        jest.spyOn(productModel, 'findOneAndDelete').mockResolvedValue(null);

        await expect(useCase.execute('product123', 'user123')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
        jest.spyOn(productModel, 'findOneAndDelete').mockRejectedValue(
            new Error('Database error'),
        );

        await expect(useCase.execute('product123', 'user123')).rejects.toThrow(
            InternalServerErrorException,
        );
    });
});
