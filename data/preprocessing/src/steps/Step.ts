import zx from 'zx';

type ProcessingUnit = 'file' | 'directory';
type CacheDataFile = {
    file: string;
    md5: string;
};
export type CacheData = {
    state: 'WAITING' | 'DONE' | 'BROKEN';

    processingUnit: ProcessingUnit;
    allowedFileExtensions: string[];

    directory: string;
    filesData: CacheDataFile[];
};
export type DataInfo = {
    cacheFile: string;
    directory: string;
    processingUnit: ProcessingUnit;
    allowedFileExtensions: string[];
};

export abstract class Step {
    public readonly stepName: string;
    protected inputInfo: DataInfo;
    protected inputCache: CacheData;
    protected outputInfo: DataInfo;
    protected outputCache: CacheData;

    constructor(stepName: string, {inputInfo, outputInfo}: {inputInfo: DataInfo, outputInfo: DataInfo}) {
        this.stepName = stepName;
        this.inputInfo = inputInfo;
        this.outputInfo = outputInfo;
    }

    protected abstract processDataUnit(filePath: string): Promise<boolean>;

    public async execute(): Promise<void> {
        if (this.outputCache.state === 'DONE') {
            // Assume nothing to do unless next step says otherwise
            return;
        }
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
                state: 'WAITING',

                processingUnit: dataInfo.processingUnit,
                allowedFileExtensions: dataInfo.allowedFileExtensions,

                directory: dataInfo.directory,
                filesData: []
            };
        }
        const cacheRawData = zx.fs.readFileSync(dataInfo.cacheFile).toString();
        return JSON.parse(cacheRawData) as CacheData;
    }
}
