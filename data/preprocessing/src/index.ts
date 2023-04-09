import 'zx/globals';
import { StepProcess } from './StepProcess';
import { DecompressStep } from './steps/DecompressStep';

async function main() {
    const process = new StepProcess();
    process.addStep(new DecompressStep());
    await process.execute();
}

main();
