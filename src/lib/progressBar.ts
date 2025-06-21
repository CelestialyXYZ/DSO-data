import { SingleBar } from "cli-progress";
import chalk from "chalk";

export default class ProgressBar {
    private bar: SingleBar;
    private taskName: string;

    constructor(taskName: string) {
        this.taskName = taskName;
        this.bar = new SingleBar({
            format: `${chalk.blue("{bar}")} | {percentage}% | ${taskName}`,
            barCompleteChar: "\u2588",
            barIncompleteChar: "\u2591",
            hideCursor: true,
        });
    }

    public start(min?: number, max?: number) {
        // initialize the bar
        this.bar.start(max || 100, min || 0);
    }

    public stop() {
        //Stop bar
        this.bar.stop();
    }

    public increment(step?: number) {
        this.bar.increment(step || 1);
    }

    public update(value: number) {
        this.bar.update(value);
    }
}