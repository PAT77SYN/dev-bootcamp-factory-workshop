---
# sandbox-good
title: Modulo operator support
status: todo
type: feature
---

Add a `%` modulo operator at the same precedence as `*` and `/`. Existing behavior is
unchanged.

## High-Level Plan

**Approach** - recognize `%` as a new operator and evaluate it at the same level as
multiplication and division. No new grammar layer is needed.

**Steps**
- Recognize the modulo operator in the input
- Evaluate it as the integer remainder
- Cover it with tests at each level

**Acceptance Criteria**
- `7 % 3` evaluates to `1`
- modulo binds at the same level as `*` and `/`
- existing expressions are unchanged (regression-safe)

**Non-Goals**
- floating-point modulo

## Refined Plan

### Files to change
- src/lexer.ts:3 - add a PERCENT token type
- src/parser.ts:85 - allow PERCENT in the term level
- src/evaluator.ts:1 - evaluate PERCENT as remainder
- tests/evaluator.test.ts:1 - `7 % 3` -> 1

### New signatures
- (none) - extends existing switches only

### Test sketch
- evaluator "modulo" - Input "7 % 3" -> 1
