import zx from 'zx';
import assert from 'node:assert/strict';

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
    protected outputsCache: CacheData[];

    constructor(stepName: string, {inputInfo, outputsInfo}: {inputInfo: DataInfo, outputsInfo: DataInfo[]}) {
        this.stepName = stepName;
        this.inputCache = Step.loadCacheFile(inputInfo);
        this.outputsCache = outputsInfo.map(Step.loadCacheFile);
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
        const allOutputsAreDone = this.outputsCache.every(outputCache => outputCache.state === 'DONE');
        if (allOutputsAreDone && !redo) {
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
        for (const outputCache of this.outputsCache) {
            const fileNames: string[] = zx.fs.readdirSync(outputCache.directory).filter(fileName => {
                switch (outputCache.processingUnit) {
                case 'directory':
                    return outputCache.directoryIsAllowed(zx.path.join(outputCache.directory, fileName));
                case 'file':
                    return outputCache.allowedFileExtensions.some(fileExt => fileName.endsWith(fileExt));
                }
            });
            const expectedFileNames = outputCache.filesData.map(fileData => fileData.file);
            if (fileNames.length !== expectedFileNames.length || !fileNames.every(fileName => expectedFileNames.includes(fileName))) {
                return false;
            }
            for(const fileData of outputCache.filesData) {
                let currentMD5: string;
                switch(outputCache.processingUnit) {
                case 'directory':
                    currentMD5 = await Step.getDirectoryMD5(fileData.file);
                    break;
                case 'file':
                    currentMD5 = await Step.getFileMD5(fileData.file);
                    break;
                }
                // If md5 is not the same from the original, we need to redo some work
                if (currentMD5 !== fileData.md5) {
                    return false;
                }
            }
        }
        return true;
    }

    private static async getFileMD5(filePath: string): Promise<string> {
        const output = await zx.$`md5sum ${filePath}`;
        return output.toString().trim();
    }

    private static async getDirectoryMD5(directoryPath: string): Promise<string> {
        const output = await zx.$`md5deep -r -l ${directoryPath} | sort | md5sum`;
        return output.toString().trim();
    }

    /**
     * Load cache from previous builds. If cache does not exists, cache
     * file will be created.
     * @param dataInfo Information about where the cache is located and what it contains
     * @returns Cache data
     */
    private static loadCacheFile(dataInfo: DataInfo): CacheData {
        if (!zx.fs.exists(dataInfo.cacheFile)) {
            let cacheDataFormat: CacheDataFormat;
            switch (dataInfo.processingUnit) {
            case 'directory':
                cacheDataFormat = {
                    processingUnit: 'directory',
                    directoryIsAllowed: dataInfo.directoryIsAllowed
                };
                break;
            case 'file':
                cacheDataFormat = {
                    processingUnit: 'file',
                    allowedFileExtensions: dataInfo.allowedFileExtensions
                };
                break;
            }

            const cacheData: CacheData = {
                ...cacheDataFormat,
                state: 'WAITING',
                directory: dataInfo.directory,
                
                filesData: [],
            };
            zx.fs.writeJSONSync(dataInfo.cacheFile, {
                ...cacheData,
                // Remove functions
                directoryIsAllowed: undefined
            });
        }
        const cacheRawData = zx.fs.readFileSync(dataInfo.cacheFile).toString();
        const cacheData = JSON.parse(cacheRawData) as CacheData;
        switch(dataInfo.processingUnit) {
        case 'directory':
            assert(cacheData.processingUnit === 'directory');
            cacheData.directoryIsAllowed = dataInfo.directoryIsAllowed;
            break;
        case 'file':
            assert(cacheData.processingUnit === 'file');
            cacheData.allowedFileExtensions = dataInfo.allowedFileExtensions;
            break;
        }
        return cacheData;
    }
}
