import { ExecutionResult, SingleInputStep } from './Step.js';
import { spawnSync } from 'node:child_process';
import * as path from 'path';

// Using global variables because super doesn't support 'this' keyword
// Ideally this could be located as readonly private variables inside the step class
const POSES_D2_POSITIONS_DIR = '/data/h36m/decompressed-poses-d2-positions';

export class DecompressStep extends SingleInputStep {
    constructor() {
        super('decompress-step', {
            inputInfo: {
                directory: '/data/h36m/raw/',
                cacheFile: './cache/1-compressed-files.json',
                processingUnit: 'file',
                allowedFileExtensions: ['.tgz']
            },
            outputsInfo: [
                {
                    directory: POSES_D2_POSITIONS_DIR,
                    cacheFile: './cache/2a-decompressed-poses-d2-positions.json',
                    processingUnit: 'directory',
                    directoryIsAllowed: async () => true
                }
            ]
        });
        spawnSync('rm', ['-rf', POSES_D2_POSITIONS_DIR + '/*']);
    }

    protected async processInputUnit(filePath: string): Promise<ExecutionResult> {
        const fileName = path.basename(filePath);
        if (fileName.startsWith('Poses_D2_Positions')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', POSES_D2_POSITIONS_DIR]);
        }
        
        // throw new Error('Method not implemented.');
        return 'Success';
    }

}