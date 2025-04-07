import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Nombre de usuario',
        nullable: false,
    })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Correo del usuario',
        nullable: false,
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty({
        description: 'Nombre de usuario',
        nullable: false,
        minLength: 6,
    })
    password: string;
}
