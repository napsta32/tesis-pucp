import * as zx from 'zx';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const ROOT_DIR = process.cwd();

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
    cacheFile: string;
    directory: string;
    fileList: CacheDataFile[];
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

export abstract class AbstractStep {
    public readonly stepName: string;
    protected outputsCache: CacheData[];

    constructor(stepName: string, {
        outputsInfo, 
        clearOutputDirectories = false
    }: {
        outputsInfo: DataInfo[], 
        clearOutputDirectories?: boolean
    }) {
        if (clearOutputDirectories) {
            for (const outputInfo of outputsInfo) {
                spawnSync('rm', ['-rf', outputInfo.directory]);
            }
        }
        
        this.stepName = stepName;
        this.outputsCache = outputsInfo.map(AbstractStep.loadCacheFile);
    }

    /**
     * Execute step only if output data was not ready or if `redo` flag
     * is enabled.
     * @param redo Redo step even if the data is valid
     * @returns Status of the processing of all files
     */
    public abstract execute({redo}: {redo: boolean}): Promise<ExecutionResult>;
    
    /**
     * Update output caches in memory and disk by manually checking what new
     * files where generated.
     */
    protected async updateOutputCaches(): Promise<void> {
        for (const index in this.outputsCache) {
            const outputCache = this.outputsCache[index];

            // Check actual files in output directory
            const allFileNames: string[] = zx.fs.readdirSync(outputCache.directory).filter(fileName => {
                switch (outputCache.processingUnit) {
                case 'directory':
                    return outputCache.directoryIsAllowed(zx.path.join(outputCache.directory, fileName));
                case 'file':
                    return outputCache.allowedFileExtensions.some(fileExt => fileName.endsWith(fileExt));
                }
            });

            // Check known files from cache
            const knownFileNames = outputCache.fileList.map(fileData => fileData.file);
            assert(knownFileNames.length <= allFileNames.length, 'Cached output files should not disappear from output directorys');
            assert(knownFileNames.every(fileName => allFileNames.includes(fileName)), 'Cached output files should not disappear from output directory');

            // Check new files that are not present in cache yet
            const newFileNames = allFileNames.filter(fileName => !knownFileNames.includes(fileName));
            for (const fileName of newFileNames) {
                // Get md5 of new file
                let fileMD5: string;
                switch(outputCache.processingUnit) {
                case 'directory':
                    fileMD5 = await AbstractStep.getDirectoryMD5(zx.path.join(outputCache.directory, fileName));
                    break;
                case 'file':
                    fileMD5 = await AbstractStep.getFileMD5(zx.path.join(outputCache.directory, fileName));
                    break;
                }
                
                // Add to cached memory
                console.log(`Adding output file ${fileName} with md5 ${fileMD5.toString()} to cache`);
                this.outputsCache[index].fileList.push({
                    file: fileName,
                    md5: fileMD5.toString()
                });

                // Add updated cache to disk
                zx.fs.writeJSONSync(zx.path.join(ROOT_DIR, outputCache.cacheFile), this.outputsCache[index]);
            }
        }
    }

    /**
     * Generate a log file with all the output files and put them in the logs directory
     */
    public async logOuputFiles(): Promise<void> {
        for (const outputCache of this.outputsCache) {
            zx.fs.ensureDirSync(zx.path.join(ROOT_DIR, './logs/'));
            const logFilePath = zx.path.join(ROOT_DIR, './logs/', zx.path.basename(outputCache.directory) + '.log');
            const logData: string = spawnSync('tree', [outputCache.directory]).output.toString();
            zx.fs.writeFileSync(logFilePath, logData);
        }
    }

    /**
     * Check that the output files md5 match the cached ones.
     * @returns Whether the output directory matches the cache
     */
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
            const expectedFileNames = outputCache.fileList.map(fileData => fileData.file);
            if (fileNames.length !== expectedFileNames.length || !fileNames.every(fileName => expectedFileNames.includes(fileName))) {
                return false;
            }
            for(const fileData of outputCache.fileList) {
                let currentMD5: string;
                switch(outputCache.processingUnit) {
                case 'directory':
                    currentMD5 = await AbstractStep.getDirectoryMD5(fileData.file);
                    break;
                case 'file':
                    currentMD5 = await AbstractStep.getFileMD5(fileData.file);
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

    /**
     * Generate an input file queue by checking what files are present in the cache
     * @param cacheData Cache that contains the input information
     * @returns A list of file names
     */
    protected static async generateInputFileQueue(cacheData: CacheData): Promise<string[]> {
        // Get all files that are going to be processed
        const files = zx.fs.readdirSync(cacheData.directory);
        const actualFileQueue: string[] = [];
        for (const fileName of files) {
            const filePath = zx.path.join(cacheData.directory, fileName);
            switch (cacheData.processingUnit) {
            case 'directory':
                if (await cacheData.directoryIsAllowed(filePath)) {
                    actualFileQueue.push(fileName);
                }
                break;
            case 'file':
                if (cacheData.allowedFileExtensions.some(fileExt => fileName.endsWith(fileExt))) {
                    actualFileQueue.push(fileName);
                }
                break;
            }
        }

        // Check that the queue is valid
        const expectedFileQueue: string[] = cacheData.fileList.map(fileData => fileData.file);
        assert.deepEqual(actualFileQueue, expectedFileQueue);
        
        // Return the file queue
        return actualFileQueue;
    }

    /**
     * Get single file md5 using md5sum.
     * @param filePath Path of the file to get its md5
     * @returns md5 string
     */
    protected static async getFileMD5(filePath: string): Promise<string> {
        const output = spawnSync('md5sum', [filePath]).output.toString();
        return output.toString().trim();
    }

    /**
     * Get directory md5 using md5deep
     * @param directoryPath Path of the directory to get its md5
     * @returns md5 string
     */
    protected static async getDirectoryMD5(directoryPath: string): Promise<string> {
        const output: string = spawnSync('md5deep', ['-r', '-l', directoryPath, '|', 'sort', '|', 'md5sum']).output.toString();
        return output.toString().trim();
    }

    /**
     * Load cache from previous builds. If cache does not exists, cache
     * file will be created.
     * @param dataInfo Information about where the cache is located and what it contains
     * @returns Cache data
     */
    protected static loadCacheFile(dataInfo: DataInfo): CacheData {
        // Create cache file if it doesn't exist in disk
        const cacheFilePath = zx.path.join(ROOT_DIR, dataInfo.cacheFile);
        if (!zx.fs.existsSync(cacheFilePath)) {
            console.log(`Could not find cache file ${cacheFilePath}`);
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
                cacheFile: dataInfo.cacheFile,
                state: 'WAITING',
                directory: dataInfo.directory,
                
                fileList: [],
            };
            console.log(`Writing basic cache template for ${cacheFilePath}`);
            zx.fs.writeJSONSync(cacheFilePath, {
                ...cacheData,
                // Remove functions
                directoryIsAllowed: undefined
            });
        }

        // Create data directory in case it doesn't exist
        if (!zx.fs.existsSync(dataInfo.directory)) {
            zx.fs.ensureDir(dataInfo.directory);
        }

        // Read existent cache file
        const cacheRawData = zx.fs.readFileSync(cacheFilePath).toString();
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

export abstract class SingleInputStep extends AbstractStep {
    protected inputCache: CacheData;

    constructor(stepName: string, {
        inputInfo,
        outputsInfo,
        clearOutputDirectories = false
    }: {
        inputInfo: DataInfo,
        outputsInfo: DataInfo[],
        clearOutputDirectories?: boolean
    }) {
        super(stepName, {outputsInfo, clearOutputDirectories});
        this.inputCache = AbstractStep.loadCacheFile(inputInfo);
    }

    /**
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
        const fileQueue = await AbstractStep.generateInputFileQueue(this.inputCache);

        // Start processing all files
        for (const fileName of fileQueue) {
            const result: ExecutionResult = await this.processInputUnit(zx.path.join(this.inputCache.directory, fileName));
            if (result !== 'Success') {
                return result;
            }

            // Update output directories
            await this.updateOutputCaches();
        }

        // Assume everything went fine
        return 'Success';
    }
}

/**
 * Describes a Step that can receive multiple inputs and return a single output.
 * TInputType is the input type after zipping all inputs into a list of inputs. By
 * default it assumes an array of strings (a list of file paths).
 */
export abstract class MultiInputStep<TInputType = string[], TNextInput = unknown> extends AbstractStep {
    protected inputsCache: CacheData[];

    constructor(stepName: string, {
        inputsInfo,
        outputsInfo,
        clearOutputDirectories = false
    }: {
        inputsInfo: DataInfo[], 
        outputsInfo: DataInfo[],
        clearOutputDirectories?: boolean
    }) {
        super(stepName, {outputsInfo, clearOutputDirectories});
        this.inputsCache = inputsInfo.map(AbstractStep.loadCacheFile);
    }

    /**
     * Zip all inputs into a single input object.
     * yields an input type object.
     * Can pass TNextInput data type if defined.
     */
    protected abstract zipInputs(): Generator<TInputType, void, TNextInput | undefined>;

    /**
     * Process a zipped input into multiple outputs.
     * @param input Input unit
     * @returns An object with the status and the nextGeneratorParameter if required.
     */
    protected abstract processInputUnit(input: TInputType): Promise<{
        status: ExecutionResult,
        nextGeneratorParameter?: TNextInput;
    }>;

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

        // Check all input directories
        this.inputsCache.map(AbstractStep.generateInputFileQueue);

        // Start processing each zipped input
        const inputIterator = this.zipInputs();
        let inputCurrent = inputIterator.next(undefined); // Use undefined for first yield
        while(!inputCurrent.done) {
            // Process zipped input
            const result = await this.processInputUnit(inputCurrent.value);
            if (result.status !== 'Success') {
                return result.status;
            }

            // Update output directories
            await this.updateOutputCaches();

            // Iterate next zipped input
            inputCurrent = inputIterator.next(result.nextGeneratorParameter);
        }
        return 'Success';
    }

}