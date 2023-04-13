import { DataInfo } from './Step';

// 1
export default {
    group1: {
        compressedData: {
            directory: '/data/h36m/raw/',
            cacheFile: './cache/1-compressed-files.json',
            processingUnit: 'file',
            allowedFileExtensions: ['.tgz'],
        } as DataInfo,
    },

    group2: {
        decompressedPoses2DPositions: {
            directory: '/data/h36m/2a-decompressed-poses-d2-positions',
            cacheFile: './cache/2a-decompressed-poses-d2-positions.json',
            processingUnit: 'directory',
            directoryIsAllowed: async () => true,
            samples: [
                'S1/MyPoseFeatures/D2_Positions/Directions 1.54138969.cdf',
                'S1/MyPoseFeatures/D2_Positions/Directions 1.55011271.cdf',
                'S1/MyPoseFeatures/D2_Positions/Directions 1.58860488.cdf',
                'S1/MyPoseFeatures/D2_Positions/Directions 1.60457274.cdf',
            ],
        } as DataInfo,
        decompressedPoses3DMonoUniversal: {
            directory: '/data/h36m/2b-decompressed-poses-d3-positions-mono-universal',
            cacheFile: './cache/2b-decompressed-poses-d3-positions-mono-universal.json',
            processingUnit: 'directory',
            directoryIsAllowed: async () => true,
            samples: [
                'S1/MyPoseFeatures/D3_Positions_mono_universal/Directions 1.54138969.cdf',
                'S1/MyPoseFeatures/D3_Positions_mono_universal/Directions 1.55011271.cdf',
                'S1/MyPoseFeatures/D3_Positions_mono_universal/Directions 1.58860488.cdf',
                'S1/MyPoseFeatures/D3_Positions_mono_universal/Directions 1.60457274.cdf',
            ],
        } as DataInfo,
        decompressedPoses3DMono: {
            directory: '/data/h36m/2c-decompressed-poses-d3-positions-mono',
            cacheFile: './cache/2c-decompressed-poses-d3-positions-mono.json',
            processingUnit: 'directory',
            directoryIsAllowed: async () => true,
            samples: [
                'S1/MyPoseFeatures/D3_Positions_mono/Directions 1.54138969.cdf',
                'S1/MyPoseFeatures/D3_Positions_mono/Directions 1.55011271.cdf',
                'S1/MyPoseFeatures/D3_Positions_mono/Directions 1.58860488.cdf',
                'S1/MyPoseFeatures/D3_Positions_mono/Directions 1.60457274.cdf',
            ],
        } as DataInfo,
        decompressedSegementsMatGTBB: {
            directory: '/data/h36m/2d-decompressed-segments-mat-gt-bb',
            cacheFile: './cache/2d-decompressed-segments-mat-gt-bb.json',
            processingUnit: 'directory',
            directoryIsAllowed: async () => true,
            samples: [
                'S1/MySegmentsMat/ground_truth_bb/Directions 1.54138969.cdf',
                'S1/MySegmentsMat/ground_truth_bb/Directions 1.55011271.cdf',
                'S1/MySegmentsMat/ground_truth_bb/Directions 1.58860488.cdf',
                'S1/MySegmentsMat/ground_truth_bb/Directions 1.60457274.cdf',
            ],
        } as DataInfo,
        decompressedVideos: {
            directory: '/data/h36m/2e-decompressed-videos',
            cacheFile: './cache/2e-decompressed-videos.json',
            processingUnit: 'directory',
            directoryIsAllowed: async () => true,
            samples: [
                'S1/Videos/Directions 1.54138969.cdf',
                'S1/Videos/Directions 1.55011271.cdf',
                'S1/Videos/Directions 1.58860488.cdf',
                'S1/Videos/Directions 1.60457274.cdf',
            ],
        } as DataInfo,
    },
};
