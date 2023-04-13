import { ExecutionResult, SingleInputStep } from './Step.js';
import { spawnSync } from 'node:child_process';
import * as path from 'path';
import { default as stepsData } from './steps-data-info.js';

export class DecompressStep extends SingleInputStep {
    constructor() {
        super('decompress-step', {
            inputInfo: stepsData.group1.compressedData,
            outputsInfo: [
                stepsData.group2.decompressedPoses2DPositions,
                stepsData.group2.decompressedPoses3DMonoUniversal,
                stepsData.group2.decompressedPoses3DMono,
                stepsData.group2.decompressedSegementsMatGTBB,
                stepsData.group2.decompressedVideos,
            ],
            clearOutputDirectories: true,
        });
    }

    protected async processInputUnit(filePath: string): Promise<ExecutionResult> {
        const fileName = path.basename(filePath);
        if (fileName.startsWith('Poses_D2_Positions_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', stepsData.group2.decompressedPoses2DPositions.directory]);
        } else if (fileName.startsWith('Poses_D3_Positions_mono_universal_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', stepsData.group2.decompressedPoses3DMonoUniversal.directory]);
        } else if (fileName.startsWith('Poses_D3_Positions_mono_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', stepsData.group2.decompressedPoses3DMono.directory]);
        } else if (fileName.startsWith('Segments_mat_gt_bb_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', stepsData.group2.decompressedSegementsMatGTBB.directory]);
        } else if (fileName.startsWith('Videos_')) {
            console.log(`Decompressing zipped file ${filePath}`);
            spawnSync('tar', ['-xzf', filePath, '-C', stepsData.group2.decompressedVideos.directory]);
        } else {
            throw `Unexpected input file ${filePath}`;
        }
        return 'Success';
    }
}
