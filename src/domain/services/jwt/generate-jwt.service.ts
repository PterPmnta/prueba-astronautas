import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GenerateJwtService {
    private readonly secretKey: string;
    private readonly expiresIn: string;

    constructor(private readonly jwtService: JwtService) {
        this.secretKey = process.env.JWT_SECRET_KEY!;
        this.expiresIn = process.env.JWT_EXPIRES_IN!;
    }

    async generateToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: this.secretKey,
            expiresIn: this.expiresIn,
        });
    }
}
