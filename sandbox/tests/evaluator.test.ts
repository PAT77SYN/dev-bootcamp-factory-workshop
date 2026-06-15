import { describe, expect, it } from "vitest";
import { evaluate } from "../src/evaluator.js";
import { parse } from "../src/parser.js";

function evalStr(src: string): number {
  return evaluate(parse(src));
}

describe("Evaluator", () => {
  it("adds", () => {
    expect(evalStr("1+2")).toBe(3);
  });

  it("multiplies", () => {
    expect(evalStr("3*4")).toBe(12);
  });

  it("truncates integer division", () => {
    expect(evalStr("10/2")).toBe(5);
    expect(evalStr("7/2")).toBe(3); // truncates, not rounds
  });

  it("subtracts", () => {
    expect(evalStr("5-3")).toBe(2);
  });

  it("respects precedence", () => {
    expect(evalStr("1+2*3")).toBe(7);
    expect(evalStr("2*3+4")).toBe(10);
    expect(evalStr("20-6/2")).toBe(17);
  });

  it("throws on division by zero", () => {
    expect(() => evalStr("1/0")).toThrow();
  });
});
