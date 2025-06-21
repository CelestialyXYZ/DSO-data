import chalk from "chalk";
import figlet from "figlet";
import { summer } from "gradient-string";
import { createSpinner, Spinner } from "nanospinner";

function print(name: string, text: string, symbol: string = " "): void {
  console.log(`${symbol} ${name} ${text}`);
}

export default {
  start: (appName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      figlet(appName, { font: "ANSI Shadow" }, (err, data) => {
        if (err) {
          reject(new Error("Failed to render ASCII art with figlet"));
          return;
        }
        // Apply a summer gradient to the ASCII art
        const colored = summer.multiline(data!);
        console.log(colored);
        resolve();
      });
    });
  },

  play: (name: string, text: string): void => {
    print(chalk.cyan.bold(`[${name}]`), chalk.magenta(text), chalk.green("▶"));
  },

  resume: (name: string, text: string): void => {
    print(chalk.cyanBright.bold(`[${name}]`), chalk.magenta(text), chalk.red("■"));
  },

  focus: (name: string, text: string): void => {
    print(chalk.green.bold(`[${name}]`), chalk.magenta.underline(text));
  },

  info: (name: string, text: string): void => {
    print(chalk.green.bold(`[${name}]`), chalk.magenta(text));
  },

  warn: (name: string, text: string): void => {
    print(chalk.yellow.bold(`[${name}]`), chalk.yellow(text), chalk.yellow("⚠"));
  },

  error: (name: string, text: string): void => {
    print(chalk.red.bold(`[${name}]`), chalk.red(text), chalk.red("✘"));
  },

  success: (name: string, text: string): void => {
    print(chalk.green.bold(`[${name}]`), chalk.magenta(text), chalk.green("✔"));
  },

  space: (number: number = 1): void => {
    if (typeof number !== "number" || number < 1) {
      throw new TypeError(`Expected number of lines to be a positive integer, got ${number}`);
    }
    console.log("\n".repeat(number - 1));
  },

  progress: {
    init: (name: string, text: string): Spinner => {
      return createSpinner(`${chalk.green.bold(`[${name}]`)} ${chalk.magenta(text)}`).start();
    },

    update: (spinner: Spinner, name: string, text: string): void => {
      spinner.update({
        text: `${chalk.green.bold(`[${name}]`)} ${chalk.magenta(text)}`
      });
    },

    succeed: (spinner: Spinner, name: string, text: string): void => {
      spinner.success({
        text: `${chalk.green.bold(`[${name}]`)} ${chalk.magenta(text)}`
      });
    },

    fail: (spinner: Spinner, name: string, text: string): void => {
      spinner.error({
        text: `${chalk.red.bold(`[${name}]`)} ${chalk.magenta(text)}`
      });
    },

    stop: (spinner: Spinner): void => {
      spinner.stop();
    }
  }
};
