import { AbstractStep } from './steps/Step.js';

export class StepProcess {
    readonly steps: AbstractStep[];

    constructor(steps: AbstractStep[] = []) {
        this.steps = steps;
    }

    addStep(step: AbstractStep) {
        this.steps.push(step);
    }

    async execute(): Promise<boolean> {
        for (const step of this.steps) {
            await step.execute({redo: false});
        }
        const lastStep = this.steps[this.steps.length];
        return await lastStep.checkOutputFiles();
    }

}