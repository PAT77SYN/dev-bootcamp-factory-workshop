# calc — Workshop Sandbox

A minimal C++17 CLI calculator. Lexer + recursive-descent parser + tree-walking
evaluator + a REPL. Used as the shared codebase for the Tag 2 PM exercise on
factory-pipeline Skills (Planner -> Refine -> Implement).

## Build & test

```bash
cmake -B build
cmake --build build
ctest --test-dir build
```

Expected: all tests pass.

## Run the REPL

```bash
./build/calc
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
  lexer.{h,cpp}      tokenization: NUMBER, PLUS, MINUS, STAR, SLASH, END
  parser.{h,cpp}     recursive-descent parser, AST nodes (Number, BinaryOp)
  evaluator.{h,cpp}  walks AST, returns int64_t
  main.cpp           REPL
tests/
  lexer_test.cpp
  parser_test.cpp
  evaluator_test.cpp
CMakeLists.txt       C++17, GoogleTest 1.14 via FetchContent
.beans/              one .md per workshop bean (see CLAUDE.md)
```
