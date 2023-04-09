import { ExecutionResult, SingleInputStep } from './Step';

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
                    directory: '/data/h36m/decompressed-videos',
                    cacheFile: './cache/2-decompressed-videos.json',
                    processingUnit: 'directory',
                    directoryIsAllowed: async () => true
                }
            ]
        });
    }

    protected async processInputUnit(filePath: string): Promise<ExecutionResult> {
        // throw new Error('Method not implemented.');
        return 'Success';
    }

}