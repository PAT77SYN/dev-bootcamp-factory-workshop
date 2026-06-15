# calc — Workshop Sandbox

A minimal TypeScript CLI calculator. Lexer + recursive-descent parser +
tree-walking evaluator + a REPL. Used as the shared codebase for the Tag 2 PM
exercise on factory-pipeline Skills (Planner -> Refine -> Implement).

## Build & test

```bash
npm install
npm run build
npm test
```

Expected: all tests pass.

## Run the REPL

```bash
npm run repl        # via tsx, no build needed
# or, after `npm run build`:
npm start           # runs node dist/main.js
```

Example session:

```
calc REPL — type 'exit' or Ctrl-D to quit
> 1+2*3
7
> 10/2
5
> 5-3
2
> 20-6/2
17
> 1/0
error: division by zero
> exit
```

`exit`, `quit`, or Ctrl-D (EOF) leave the loop. Parse and runtime errors are
caught, printed, and the REPL continues.

## Grammar (today)

```
expr   -> term   (('+' | '-') term)*
term   -> factor (('*' | '/') factor)*
factor -> NUMBER
```

Integers only. Left-associative `+ -` and `* /`. Whitespace ignored.

The workshop beans extend this grammar — parentheses, variables, math
functions — see `.beans/`.

## Layout

```
src/
  lexer.ts        tokenization: NUMBER, PLUS, MINUS, STAR, SLASH, END
  parser.ts       recursive-descent parser, AST nodes (Number, BinaryOp)
  evaluator.ts    walks AST, returns number
  main.ts         REPL
tests/
  lexer.test.ts
  parser.test.ts
  evaluator.test.ts
package.json      scripts, deps (Vitest), ESM
tsconfig.json     TypeScript config (strict mode)
.beans/           one .md per workshop bean (see CLAUDE.md)
```
