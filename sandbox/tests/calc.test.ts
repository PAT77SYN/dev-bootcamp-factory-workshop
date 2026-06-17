import { describe, expect, it } from "vitest";
import { evaluate } from "../src/evaluator.js";
import { formatResult } from "../src/format.js";
import { parse } from "../src/parser.js";

function calc(src: string): string {
  return formatResult(evaluate(parse(src)));
}

describe("Calculator end-to-end (AC)", () => {
  it("2+2 → 4 (integer, no trailing comma)", () => {
    expect(calc("2+2")).toBe("4");
  });

  it("1,5+2,5 → 4", () => {
    expect(calc("1,5+2,5")).toBe("4");
  });

  it("7/2 → 3,5", () => {
    expect(calc("7/2")).toBe("3,5");
  });

  it("1,5*2 → 3", () => {
    expect(calc("1,5*2")).toBe("3");
  });

  it("1/0 → throws Error", () => {
    expect(() => calc("1/0")).toThrow(Error);
  });

  it("output never contains a dot as decimal separator", () => {
    expect(calc("7/2")).not.toContain(".");
    expect(calc("1,5+2,5")).not.toContain(".");
  });
});
