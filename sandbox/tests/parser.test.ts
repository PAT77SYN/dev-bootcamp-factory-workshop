import { describe, expect, it } from "vitest";
import { BinOp, NodeKind, parse } from "../src/parser.js";

describe("Parser", () => {
  it("parses a single number", () => {
    const node = parse("7");
    expect(node.kind).toBe(NodeKind.Number);
    expect(node.value).toBe(7);
  });

  it("treats flat addition as left-associative", () => {
    // "1 + 2 + 3" parses as ((1 + 2) + 3)
    const node = parse("1 + 2 + 3");
    expect(node.kind).toBe(NodeKind.BinaryOp);
    expect(node.op).toBe(BinOp.Add);

    const left = node.left!;
    expect(left.kind).toBe(NodeKind.BinaryOp);
    expect(left.op).toBe(BinOp.Add);
    expect(left.left!.value).toBe(1);
    expect(left.right!.value).toBe(2);

    expect(node.right!.kind).toBe(NodeKind.Number);
    expect(node.right!.value).toBe(3);
  });

  it("binds multiplication tighter than addition", () => {
    // "1 + 2 * 3" parses as (1 + (2 * 3))
    const node = parse("1 + 2 * 3");
    expect(node.kind).toBe(NodeKind.BinaryOp);
    expect(node.op).toBe(BinOp.Add);
    expect(node.left!.value).toBe(1);

    const right = node.right!;
    expect(right.kind).toBe(NodeKind.BinaryOp);
    expect(right.op).toBe(BinOp.Mul);
    expect(right.left!.value).toBe(2);
    expect(right.right!.value).toBe(3);
  });

  it("throws on a trailing token", () => {
    expect(() => parse("1 2")).toThrow();
  });

  it("throws on a missing operand", () => {
    expect(() => parse("1 +")).toThrow();
  });
});
