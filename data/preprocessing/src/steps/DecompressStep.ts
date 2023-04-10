import { ExecutionResult, SingleInputStep } from './Step.js';
import { spawnSync } from 'node:child_process';
import * as path from 'path';

// Using global variables because super doesn't support 'this' keyword
// Ideally this could be located as readonly private variables inside the step class
const POSES_D2_POSITIONS_DIR = '/data/h36m/2a-decompressed-poses-d2-positions';
const POSES_D3_POSITIONS_MONO_UNIVERSAL_DIR = '/data/h36m/2b-decompressed-poses-d3-positions-mono-universal';
const POSES_D3_POSITIONS_MONO_DIR = '/data/h36m/2c-decompressed-poses-d3-positions-mono';
const SEGMENTS_MAT_GT_BB = '/data/h36m/2d-decompressed-segments-mat-gt-bb';
const VIDEOS = '/data/h36m/2e-decompressed-videos';

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
                },
                {
                    directory: POSES_D3_POSITIONS_MONO_UNIVERSAL_DIR,
                    cacheFile: './cache/2b-decompressed-poses-d3-positions-mono-universal.json',
                    processingUnit: 'directory',
                    directoryIsAllowed: async () => true
                },
                {
                    directory: POSES_D3_POSITIONS_MONO_DIR,
                    cacheFile: './cache/2c-decompressed-poses-d3-positions-mono.json',
                    processingUnit: 'directory',
                    directoryIsAllowed: async () => true
                },
                {
                    directory: SEGMENTS_MAT_GT_BB,
                    cacheFile: './cache/2d-decompressed-segments-mat-gt-bb.json',
                    processingUnit: 'directory',
                    directoryIsAllowed: async () => true
                },
                {
                    directory: VIDEOS,
                    cacheFile: './cache/2e-decompressed-videos.json',
                    processingUnit: 'directory',
                    directoryIsAllowed: async () => true
                },
            ],
            clearOutputDirectories: true
        });
    }

    protected async processInputUnit(filePath: string): Promise<ExecutionResult> {
        const fileName = path.basename(filePath);
        if (fileName.startsWith('Poses_D2_Positions_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', POSES_D2_POSITIONS_DIR]);
        } else if (fileName.startsWith('Poses_D3_Positions_mono_universal_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', POSES_D3_POSITIONS_MONO_UNIVERSAL_DIR]);
        } else if (fileName.startsWith('Poses_D3_Positions_mono_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', POSES_D3_POSITIONS_MONO_DIR]);
        } else if (fileName.startsWith('Segments_mat_gt_bb_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', SEGMENTS_MAT_GT_BB]);
        } else if (fileName.startsWith('Videos_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', VIDEOS]);
        } else {
            throw `Unexpected input file ${filePath}`;
        }
        return 'Success';
    }

}