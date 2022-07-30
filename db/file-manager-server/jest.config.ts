import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters: [
        'default',
        ['jest-junit', {outputDirectory: 'reports', outputName: 'junit.xml'}]
    ],
    verbose: true,
    collectCoverage: true,
    coverageReporters: ['cobertura', 'text', 'lcov', 'html'],
    coverageDirectory: 'reports/coverage',
    coverageThreshold: {
        global: {
            lines: 80
        },
        './src/api': {
            branches: 100,
            functions: 100,
            lines: 100
        }
    },
    roots: ['<rootDir>/src'],
    forceExit: true,
    setupFiles: [
        '<rootDir>/test-global-setup.ts'
    ]
};
export default config;
