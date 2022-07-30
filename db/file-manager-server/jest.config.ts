import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80
        }
    },
    roots: ['<rootDir>/src/']
};
export default config;
