import { describe, expect, it } from "vitest";
import { Lexer, TokenType } from "../src/lexer.js";

describe("Lexer", () => {
  it("tokenizes a single number", () => {
    const lexer = new Lexer("42");
    const tok = lexer.next();
    expect(tok.type).toBe(TokenType.NUMBER);
    expect(tok.value).toBe(42);
    expect(lexer.next().type).toBe(TokenType.END);
  });

  it("tokenizes all operators", () => {
    const lexer = new Lexer("+-*/");
    expect(lexer.next().type).toBe(TokenType.PLUS);
    expect(lexer.next().type).toBe(TokenType.MINUS);
    expect(lexer.next().type).toBe(TokenType.STAR);
    expect(lexer.next().type).toBe(TokenType.SLASH);
    expect(lexer.next().type).toBe(TokenType.END);
  });

  it("skips whitespace and reads a mixed expression", () => {
    const lexer = new Lexer("  12 + 30 ");
    const first = lexer.next();
    expect(first.type).toBe(TokenType.NUMBER);
    expect(first.value).toBe(12);
    expect(lexer.next().type).toBe(TokenType.PLUS);
    const third = lexer.next();
    expect(third.type).toBe(TokenType.NUMBER);
    expect(third.value).toBe(30);
    expect(lexer.next().type).toBe(TokenType.END);
  });

  it("returns END idempotently", () => {
    const lexer = new Lexer("");
    expect(lexer.next().type).toBe(TokenType.END);
    expect(lexer.next().type).toBe(TokenType.END);
  });

  it("throws on an unknown character", () => {
    const lexer = new Lexer("1 ? 2");
    expect(lexer.next().type).toBe(TokenType.NUMBER);
    expect(() => lexer.next()).toThrow();
  });

  it("tokenizes a decimal literal with comma", () => {
    const lexer = new Lexer("1,5");
    const tok = lexer.next();
    expect(tok.type).toBe(TokenType.NUMBER);
    expect(tok.value).toBe(1.5);
    expect(lexer.next().type).toBe(TokenType.END);
  });

  it("tokenizes multi-digit decimal literal", () => {
    const lexer = new Lexer("12,75");
    const tok = lexer.next();
    expect(tok.type).toBe(TokenType.NUMBER);
    expect(tok.value).toBe(12.75);
  });

  it("throws on a second decimal comma in a literal", () => {
    const lexer = new Lexer("1,5,2");
    expect(() => lexer.next()).toThrow();
  });
});
