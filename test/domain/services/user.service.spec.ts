import * as bcrypt from 'bcrypt';
import { UserService } from '../../../src/domain/services/user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        service = new UserService();
    });

    describe('hashPassword', () => {
        it('should generate a hash different from the original password', async () => {
            const password = 'superSecret123';
            const hash = await service.hashPassword(password);

            expect(hash).not.toEqual(password);
            expect(typeof hash).toBe('string');
            expect(hash.length).toBeGreaterThan(0);
        });

        it('should generate a valid bcrypt hash', async () => {
            const password = 'testPassword';
            const hash = await service.hashPassword(password);

            const isValid = await bcrypt.compare(password, hash);
            expect(isValid).toBe(true);
        });
    });

    describe('comparePassword', () => {
        it('should return true for matching password and hash', async () => {
            const password = 'matchMe123';
            const hash = await bcrypt.hash(password, 10);

            const result = await service.comparePassword(password, hash);
            expect(result).toBe(true);
        });

        it('should return false for non-matching password and hash', async () => {
            const password = 'wrongPassword';
            const hash = await bcrypt.hash('realPassword', 10);

            const result = await service.comparePassword(password, hash);
            expect(result).toBe(false);
        });
    });
});
