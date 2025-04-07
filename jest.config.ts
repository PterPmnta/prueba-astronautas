export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.spec.ts$', // <-- importante para pruebas unitarias
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    preset: 'ts-jest',
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    forceExit: true,
};
