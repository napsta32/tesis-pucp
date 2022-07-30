import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80
        }
    },
    rootDir: 'src',
    forceExit: true,
    detectOpenHandles: true,
    setupFiles: [
        './test-global-teardown.ts'
    ]
};
export default config;
