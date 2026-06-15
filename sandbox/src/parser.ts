// Recursive descent. AST = Node { kind, value, op, left, right }.

import { Lexer, Token, TokenType, tokenTypeName } from "./lexer.js";

// Tiny AST. Two node kinds, one shared shape. We use plain enums and a single
// Node interface with optional children — simple structs over deep OOP.

export enum NodeKind {
  Number,
  BinaryOp,
}

export enum BinOp {
  Add,
  Sub,
  Mul,
  Div,
}

export interface Node {
  kind: NodeKind;

  // Number payload
  value?: number;

  // BinaryOp payload
  op?: BinOp;
  left?: Node;
  right?: Node;
}

// Recursive-descent parser holding a peeked token. Grammar:
//   expr   -> term   (('+' | '-') term)*
//   term   -> factor (('*' | '/') factor)*
//   factor -> NUMBER
class Parser {
  private readonly lexer: Lexer;
  private current: Token;

  constructor(source: string) {
    this.lexer = new Lexer(source);
    this.current = this.lexer.next();
  }

  parseExpr(): Node {
    let left = this.parseTerm();
    while (this.check(TokenType.PLUS) || this.check(TokenType.MINUS)) {
      const op = this.check(TokenType.PLUS) ? BinOp.Add : BinOp.Sub;
      this.advance();
      const right = this.parseTerm();
      left = makeBinary(op, left, right);
    }
    return left;
  }

  expectEnd(): void {
    if (!this.check(TokenType.END)) {
      throw new Error(
        `unexpected token ${tokenTypeName(this.current.type)} at position ` +
          `${this.current.pos} (expected end of input)`,
      );
    }
  }

  // True when the current (peeked) token is of the given type.
  private check(type: TokenType): boolean {
    return this.current.type === type;
  }

  private advance(): void {
    this.current = this.lexer.next();
  }

  private parseTerm(): Node {
    let left = this.parseFactor();
    while (this.check(TokenType.STAR) || this.check(TokenType.SLASH)) {
      const op = this.check(TokenType.STAR) ? BinOp.Mul : BinOp.Div;
      this.advance();
      const right = this.parseFactor();
      left = makeBinary(op, left, right);
    }
    return left;
  }

  private parseFactor(): Node {
    if (!this.check(TokenType.NUMBER)) {
      throw new Error(
        `expected NUMBER but got ${tokenTypeName(this.current.type)} ` +
          `at position ${this.current.pos}`,
      );
    }
    const node: Node = { kind: NodeKind.Number, value: this.current.value };
    this.advance();
    return node;
  }
}

function makeBinary(op: BinOp, left: Node, right: Node): Node {
  return { kind: NodeKind.BinaryOp, op, left, right };
}

// Parse a full expression from `source`. Throws Error on syntactic problems
// (unexpected tokens, trailing input, etc.).
export function parse(source: string): Node {
  const parser = new Parser(source);
  const root = parser.parseExpr();
  parser.expectEnd();
  return root;
}
