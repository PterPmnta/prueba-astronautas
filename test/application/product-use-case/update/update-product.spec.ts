import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

import { UpdateProductUseCase } from '../../../../src/application/product-use-case/update/update-product';
import { ProductSchema } from '../../../../src/domain/entitties/product.schema';
import { UpdateProductDto } from '../../../../src/application/product-use-case/update/update-product.dto';
import { UpdateProductResultDto } from '../../../../src/infraestructure/api/product/update/update-product-result.dto';

describe('UpdateProductUseCase', () => {
    let useCase: UpdateProductUseCase;
    let productModel: Model<ProductSchema>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateProductUseCase,
                {
                    provide: getModelToken(ProductSchema.name),
                    useValue: {
                        findOneAndUpdate: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get(UpdateProductUseCase);
        productModel = module.get(getModelToken(ProductSchema.name));
    });

    it('should update a product successfully', async () => {
        const id = 'product123';
        const userId = 'user456';
        const dto: UpdateProductDto = {
            name: 'Updated Product',
            price: 199.99,
        };

        const updatedProduct = {
            _id: id,
            name: dto.name,
            price: dto.price,
            userId,
        };

        jest.spyOn(productModel, 'findOneAndUpdate').mockResolvedValue(
            updatedProduct,
        );

        const result: UpdateProductResultDto = await useCase.execute(
            id,
            dto,
            userId,
        );

        expect(result).toEqual({
            id,
            name: dto.name,
            price: dto.price,
        });

        expect(productModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: id, userId },
            dto,
            { new: true },
        );
    });

    it('should throw an error if product not found', async () => {
        const id = 'product123';
        const userId = 'user456';
        const dto: UpdateProductDto = {
            name: 'Updated Product',
            price: 199.99,
        };

        jest.spyOn(productModel, 'findOneAndUpdate').mockResolvedValue(null);

        await expect(useCase.execute(id, dto, userId)).rejects.toThrow(
            BadRequestException,
        );

        expect(productModel.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw BadRequestException on unexpected error', async () => {
        const id = 'product123';
        const userId = 'user456';
        const dto: UpdateProductDto = {
            name: 'Updated Product',
            price: 199.99,
        };

        jest.spyOn(productModel, 'findOneAndUpdate').mockRejectedValue(
            new Error('DB error'),
        );

        await expect(useCase.execute(id, dto, userId)).rejects.toThrow(
            BadRequestException,
        );
    });
});
