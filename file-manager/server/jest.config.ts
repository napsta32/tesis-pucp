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
    // coverageDirectory: 'reports/coverage',
    coverageThreshold: {
        global: {lines: 80},
        './src/index.ts': {},
        './src/data-source.ts': {},
        './src/api': {
            branches: 80,
            functions: 80,
            lines: 80
        }
    },
    roots: ['<rootDir>/src'],
    forceExit: true,
    detectOpenHandles: true,
    maxWorkers: 1
};
export default config;
