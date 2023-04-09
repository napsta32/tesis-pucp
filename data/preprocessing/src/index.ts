import { StepProcess } from './StepProcess.js';
import { DecompressStep } from './steps/DecompressStep.js';

async function main() {
    const process = new StepProcess();
    process.addStep(new DecompressStep());
    await process.execute();
}

main();
