import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Nombre del producto',
        nullable: false,
    })
    name: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Min(0)
    @ApiProperty({
        description: 'Precio del producto',
        nullable: false,
    })
    price: number;
}
