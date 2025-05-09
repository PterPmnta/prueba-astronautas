import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../domain/guards/jwt-auth.guard';
import { CurrentUser } from '../../../domain/decorators/current-user.decorator';

import { CreateProductResultDto } from './create/create-product-result.dto';

import { CreateProductDto } from '../../../application/product-use-case/create/create-product.dto';
import { CreateProductInterface } from '../../../application/product-use-case/create/create-product.interface';
import { GetProductByUserIdInterface } from '../../../application/product-use-case/get/get-product.interface';
import { UpdateProductInterface } from '../../../application/product-use-case/update/update-product.interface';
import { UpdateProductDto } from '../../../application/product-use-case/update/update-product.dto';
import { DeleteProductInterface } from '../../../application/product-use-case/delete/delete-product.interface';

@ApiTags('Product')
@ApiBearerAuth('jwt')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(
        @Inject('CreateProductInterface')
        private readonly createProductUseCase: CreateProductInterface,
        @Inject('GetProductByUserIdInterface')
        private readonly getProductByUserIdUseCase: GetProductByUserIdInterface,
        @Inject('UpdateProductInterface')
        private readonly updateProductUseCase: UpdateProductInterface,
        @Inject('DeleteProductInterface')
        private readonly deleteProductUseCase: DeleteProductInterface,
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

    @Patch(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @CurrentUser() user,
    ) {
        return this.updateProductUseCase.execute(id, updateProductDto, user.id);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string, @CurrentUser() user) {
        return this.deleteProductUseCase.execute(id, user.id);
    }
}
