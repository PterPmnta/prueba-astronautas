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
    name: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Min(0)
    price: number;
}
