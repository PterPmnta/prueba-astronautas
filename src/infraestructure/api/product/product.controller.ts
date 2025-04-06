import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../domain/guards/jwt-auth.guard';
import { CurrentUser } from '../../../domain/decorators/current-user.decorator';

import { CreateProductResultDto } from './create/create-product-result.dto';

import { CreateProductDto } from '../../../application/product-use-case/create/create-product.dto';
import { CreateProductInterface } from '../../../application/product-use-case/create/create-product.interface';
import { GetProductByUserIdInterface } from '../../../application/product-use-case/get/get-product.interface';

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(
        @Inject('CreateProductInterface')
        private readonly createProductUseCase: CreateProductInterface,
        @Inject('GetProductByUserIdInterface')
        private readonly getProductByUserIdUseCase: GetProductByUserIdInterface,
    ) {}

    @Post()
    async createProduct(
        @Body() dto: CreateProductDto,
        @CurrentUser() user,
    ): Promise<CreateProductResultDto> {
        return this.createProductUseCase.execute(dto, user.id);
    }

    @Get()
    async getProductByUserId(@CurrentUser() user) {
        return this.getProductByUserIdUseCase.execute(user.id);
    }
}
