import { Step } from './steps/Step';

export class StepProcess {
    readonly steps: Step[];

    constructor(steps: Step[] = []) {
        this.steps = steps;
    }

    addStep(step: Step) {
        this.steps.push(step);
    }

    async execute(): Promise<boolean> {
        for (const step of this.steps) {
            await step.execute();
        }
        const lastStep = this.steps[this.steps.length];
        return await lastStep.checkOutputFiles();
    }

}