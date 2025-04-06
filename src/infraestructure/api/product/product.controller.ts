import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../domain/guards/jwt-auth.guard';
import { CurrentUser } from '../../../domain/decorators/current-user.decorator';

import { CreateProductResultDto } from './create-product-result.dto';

import { CreateProductDto } from '../../../application/product-use-case/create/create-product.dto';
import { CreateProductInterface } from '../../../application/product-use-case/create/create-product.interface';

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(
        @Inject('CreateProductInterface')
        private readonly createProductUseCase: CreateProductInterface,
    ) {}

    @Post()
    async createProduct(
        @Body() dto: CreateProductDto,
        @CurrentUser() user,
    ): Promise<CreateProductResultDto> {
        return this.createProductUseCase.execute(dto, user.id);
    }
}
