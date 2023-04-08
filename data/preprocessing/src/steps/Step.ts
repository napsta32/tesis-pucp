import zx from 'zx';

type CacheDataFile = {
    file: string;
    md5: string;
};
type CacheDataFormat = {
    processingUnit: 'file';
    allowedFileExtensions: string[];
} | {
    processingUnit: 'directory';
    directoryIsAllowed: (directoryPath: string) => Promise<boolean>;
};
export type CacheData = {
    state: 'WAITING' | 'DONE' | 'BROKEN';
    directory: string;
    filesData: CacheDataFile[];
} & CacheDataFormat;
export type DataInfo = {
    cacheFile: string;
    directory: string;
} & CacheDataFormat;

export type ExecutionResult = |
    // Everything went fine
    'Success' | 
    // Something went wrong
    'Failure' | 
    // We need to redo previous step
    'StepBack';

export abstract class Step {
    public readonly stepName: string;
    protected inputCache: CacheData;
    protected outputCache: CacheData;

    constructor(stepName: string, {inputInfo, outputInfo}: {inputInfo: DataInfo, outputInfo: DataInfo}) {
        this.stepName = stepName;
        this.inputCache = Step.loadCacheFile(inputInfo);
        this.outputCache = Step.loadCacheFile(outputInfo);
    }

    /**
     * @override
     * Override this function for custom logic to filter file paths.
     * @param _filePath File path to check
     * @returns Whether to ignore this path in the step execution
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async ignoreFilePath(filePath: string) {
        return false;
    }

    /**
     * Process single file or directory from the input directory.
     * @param filePath File path of the input to be processed
     * @returns Status of the processing
     */
    protected abstract processInputUnit(filePath: string): Promise<ExecutionResult>;

    /**
     * Execute step only if output data was not ready or if `redo` flag
     * is enabled.
     * @param redo Redo step even if the data is valid
     * @returns Status of the processing of all files
     */
    public async execute({redo}: {redo: boolean}): Promise<ExecutionResult> {
        if (this.outputCache.state === 'DONE' && !redo) {
            // Assume nothing to do unless next step says otherwise
            return 'Success';
        }

        // Get all files that are going to be processed
        const files = zx.fs.readdirSync(this.inputCache.directory);
        const fileQueue = [];
        for (const fileName of files) {
            const filePath = zx.path.join(this.inputCache.directory, fileName);
            switch (this.inputCache.processingUnit) {
            case 'directory':
                if (await this.inputCache.directoryIsAllowed(filePath)) {
                    fileQueue.push(fileName);
                }
                break;
            case 'file':
                if (this.inputCache.allowedFileExtensions.some(fileExt => fileName.endsWith(fileExt))) {
                    fileQueue.push(fileName);
                }
                break;
            }
        }

        // Check that the queue is valid

        // Start processing all files
        throw 'Not implemented';
    }

    public async checkOutputFiles(): Promise<boolean> {
        for(const fileData of this.outputCache.filesData) {
            const currentMD5 = (await (zx.$`md5sum ${zx.path.join(this.outputCache.directory, fileData.file)}`)).toString();
            // If md5 is not the same from the original, we need to redo some work
            if (currentMD5 !== fileData.md5) {
                return false;
            }
        }
        return true;
    }

    private static async getFileMD5(filePath: string) {
        const output = await zx.$`md5sum ${filePath}`;
        return output.toString().trim();
    }

    private static async getDirectoryMD5(directoryPath: string) {
        const output = await zx.$`md5deep -r -l ${directoryPath} | sort | md5sum`;
        return output.toString().trim();
    }

    private static loadCacheFile(dataInfo: DataInfo): CacheData {
        if (!zx.fs.exists(dataInfo.cacheFile)) {
            return {
                ...dataInfo,
                
                state: 'WAITING',
                filesData: []
            };
        }
        const cacheRawData = zx.fs.readFileSync(dataInfo.cacheFile).toString();
        return JSON.parse(cacheRawData) as CacheData;
    }
}
