# 03 — Refine Bean

Time: 45-60 minutes  
Level: 3

## Goal

Build or improve `/refine`: it reads a Bean with `## High-Level Plan`, explores the codebase through one read-only subagent, and appends `## Refined Plan`.

Participants who are not ready can use:

```text
../../supplied/refine/.claude/skills/refine/SKILL.md
```

## Exercise

Create:

```text
sandbox/.claude/skills/refine/SKILL.md
```

Frontmatter:

```yaml
---
name: refine
description: Use after /planner. Takes a Bean with ## High-Level Plan, explores the codebase through a read-only subagent, and appends ## Refined Plan.
argument-hint: <bean-id>
allowed-tools: Read, Grep, Glob, Bash, Task
---
```

Required workflow:

1. Read the Bean with `beans show <bean-id> --json`.
2. Parse `.body`.
3. Extract the literal `## High-Level Plan` section.
4. Abort if the section is missing.
5. Set status to `in-progress`.
6. Dispatch exactly one read-only subagent to explore the codebase.
7. Compose and append `## Refined Plan`.
8. Verify every referenced existing path.

Required schema:

```markdown
## Refined Plan

### Files to change
- path:line — what changes
- path:NEW — why a new file is needed

### New signatures
- ReturnType function_name(Args) — purpose

### Test sketch
- test_name — Input -> Expected
```

## Hard Rules

- Do not edit source code.
- Do not edit `.beans/*.md` directly.
- Use exactly one subagent dispatch.
- Subagent is read-only: no edits, no builds, no tests.
- Every existing path in the refined plan must be verified.
- The heading must be exactly `## Refined Plan`.

## Test

Use a Bean produced by `/planner`, or copy one from:

```text
../../supplied/seeded-beans/refine-ready/
```

Then run:

```bash
cd sandbox
claude
> /refine <bean-id>
```

Reference solution:

```text
solution/.claude/skills/refine/SKILL.md
```
