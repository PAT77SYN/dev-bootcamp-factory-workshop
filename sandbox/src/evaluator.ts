// Walks the AST, returns a number. Throws Error on div-by-zero.

import { BinOp, Node, NodeKind } from "./parser.js";

// Walk the AST and return the integer result. Throws Error on division by
// zero. Pure integer arithmetic — no floats.
export function evaluate(node: Node): number {
  switch (node.kind) {
    case NodeKind.Number:
      return node.value!;

    case NodeKind.BinaryOp: {
      const left = evaluate(node.left!);
      const right = evaluate(node.right!);
      switch (node.op!) {
        case BinOp.Add:
          return left + right;
        case BinOp.Sub:
          return left - right;
        case BinOp.Mul:
          return left * right;
        case BinOp.Div:
          if (right === 0) {
            throw new Error("division by zero");
          }
          return Math.trunc(left / right);
      }
    }
  }
  throw new Error("evaluator: unknown node kind");
}
