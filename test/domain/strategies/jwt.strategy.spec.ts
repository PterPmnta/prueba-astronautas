import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from '../../../src/domain/strategies/jwt.strategy';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let configService: ConfigService;

    beforeEach(() => {
        configService = {
            get: jest.fn().mockReturnValue('test_secret_key'),
        } as any;

        jwtStrategy = new JwtStrategy(configService);
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    it('should call ConfigService.get with correct key', () => {
        expect(configService.get).toHaveBeenCalledWith('JWT_SECRET_KEY');
    });

    it('should validate and return payload with id', async () => {
        const payload = { id: 'user123', name: 'John' };
        const result = await jwtStrategy.validate(payload);
        expect(result).toEqual({ id: 'user123' });
    });
});
