# 04 — Planning Skill

Track: Both  
Time: 30-35 minutes

## Goal

Build a Skill that produces a durable planning artifact.

This is the bridge from "Skill as helper" to "Skill as factory station."

## Exercise

Create:

```text
exercise/.claude/skills/planner/SKILL.md
```

Minimum frontmatter:

```yaml
---
name: planner
description: Use when the user wants to plan a non-trivial change before writing code. Produces a written plan file, not implementation.
---
```

Required workflow:

1. Explore project context before asking questions.
2. Ask one question per message if clarification is needed.
3. Present 2-3 approaches with trade-offs.
4. Stop and wait for the user's explicit approach choice.
5. Self-review before writing.
6. Write the plan to `.plans/<task>.md`.

Required plan sections:

```markdown
# <Task Title>

## Problem

## Constraints

## Non-Goals

## Chosen Approach

## Steps

## Verification
```

## Advanced Variant

If you already know Skills, make the planner stricter:

- hard approach gate
- no implementation until explicitly requested
- stronger self-review
- stable schema
- clear hand-off statement

## Afternoon Bridge

In the afternoon, the planner writes a Bean instead of `.plans/<task>.md`.

The idea is the same:

```text
Skill -> durable artifact -> next factory station
```

Reference solution:

```text
solution/.claude/skills/planner/SKILL.md
```

