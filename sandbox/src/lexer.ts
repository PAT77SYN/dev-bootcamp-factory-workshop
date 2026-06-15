// Token stream. Types: NUMBER, PLUS, MINUS, STAR, SLASH, END.

export enum TokenType {
  NUMBER,
  PLUS,
  MINUS,
  STAR,
  SLASH,
  END,
}

export interface Token {
  type: TokenType;
  value: number; // populated when type === NUMBER
  pos: number; // 0-based offset in source, for error messages
}

// Stream-style lexer. Construct over a source string, then call next() to
// advance through the token stream. Returns TokenType.END at end of input
// (and keeps returning it on subsequent calls).
export class Lexer {
  private readonly source: string;
  private pos = 0;

  constructor(source: string) {
    this.source = source;
  }

  next(): Token {
    this.skipWhitespace();

    if (this.pos >= this.source.length) {
      return { type: TokenType.END, value: 0, pos: this.pos };
    }

    const start = this.pos;
    const c = this.source[this.pos];

    if (isDigit(c)) {
      let value = 0;
      while (this.pos < this.source.length && isDigit(this.source[this.pos])) {
        value = value * 10 + (this.source.charCodeAt(this.pos) - 48);
        this.pos++;
      }
      return { type: TokenType.NUMBER, value, pos: start };
    }

    this.pos++;
    switch (c) {
      case "+":
        return { type: TokenType.PLUS, value: 0, pos: start };
      case "-":
        return { type: TokenType.MINUS, value: 0, pos: start };
      case "*":
        return { type: TokenType.STAR, value: 0, pos: start };
      case "/":
        return { type: TokenType.SLASH, value: 0, pos: start };
      default:
        throw new Error(
          `unexpected character '${c}' at position ${start}`,
        );
    }
  }

  private skipWhitespace(): void {
    while (this.pos < this.source.length && isSpace(this.source[this.pos])) {
      this.pos++;
    }
  }
}

export function tokenTypeName(type: TokenType): string {
  switch (type) {
    case TokenType.NUMBER:
      return "NUMBER";
    case TokenType.PLUS:
      return "PLUS";
    case TokenType.MINUS:
      return "MINUS";
    case TokenType.STAR:
      return "STAR";
    case TokenType.SLASH:
      return "SLASH";
    case TokenType.END:
      return "END";
  }
}

function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function isSpace(c: string): boolean {
  return c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f" || c === "\v";
}
