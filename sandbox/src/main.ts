// REPL. Catches Error, prints, continues.

import { createInterface } from "node:readline";
import { evaluate } from "./evaluator.js";
import { parse } from "./parser.js";

function main(): void {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write("calc REPL — type 'exit' or Ctrl-D to quit\n");
  process.stdout.write("> ");

  rl.on("line", (line) => {
    if (line === "exit" || line === "quit") {
      rl.close();
      return;
    }
    if (line.length !== 0) {
      try {
        const ast = parse(line);
        process.stdout.write(`${evaluate(ast)}\n`);
      } catch (err) {
        process.stdout.write(`error: ${(err as Error).message}\n`);
      }
    }
    process.stdout.write("> ");
  });

  rl.on("close", () => {
    process.stdout.write("\n");
  });
}

main();
