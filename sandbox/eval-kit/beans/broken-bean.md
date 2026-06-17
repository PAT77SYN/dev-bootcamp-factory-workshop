---
# sandbox-bad
title: Modulo operator support
status: todo
type: feature
---

Add a `%` modulo operator. Existing behavior is unchanged.

## High-Level Plan

**Approach** - edit src/parser.ts to add a branch in parseTerm() for the `%` token, and update
the evaluator switch.

**Steps**
- Modify the lexer file to add the token
- Update parseTerm in the parser

**Acceptance Criteria**
- it works

**Non-Goals**
- (none)

## Refined Plan

### Files to change
- src/tokenizer.ts:10 - add a PERCENT token
- src/evaluator.ts:1 - evaluate PERCENT

### New signatures
- (none)

### Test sketch
- it works
