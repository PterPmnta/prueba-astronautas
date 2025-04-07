import { ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from '../../../src/domain/decorators/current-user.decorator';

describe('getCurrentUser', () => {
    it('should return user from request', () => {
        const mockUser = { id: 'user123', name: 'Test User' };

        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: mockUser,
                }),
            }),
        } as unknown as ExecutionContext;

        const result = getCurrentUser(mockContext);
        expect(result).toEqual(mockUser);
    });

    it('should return undefined if user not found in request', () => {
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({}),
            }),
        } as unknown as ExecutionContext;

        const result = getCurrentUser(mockContext);
        expect(result).toBeUndefined();
    });
});
