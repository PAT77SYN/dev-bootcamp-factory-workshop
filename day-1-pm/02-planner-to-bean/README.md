# 02 — Planner to Bean

Time: 30-45 minutes  
Level: 2

## Goal

Adapt a planning Skill so it creates a Bean instead of a `.plans/<task>.md` file.

Participants who are not ready can use:

```text
../../supplied/planner/.claude/skills/planner/SKILL.md
```

## Exercise

Create:

```text
sandbox/.claude/skills/planner/SKILL.md
```

Frontmatter:

```yaml
---
name: planner
description: Use when starting a new feature. Creates a new Bean with a high-level plan and acceptance criteria. No code, no file paths.
argument-hint: brief feature description
allowed-tools: Read, Grep, Glob, Bash
---
```

Required workflow:

1. Capture the feature idea.
2. Clarify only if needed.
3. Present 2-3 approaches.
4. Stop and wait for the user's explicit approach choice.
5. Self-review for abstraction level.
6. Create a Bean through the `beans` CLI.

Required Bean section:

```markdown
## High-Level Plan

**Approach** — ...

**Steps**
- ...

**Acceptance Criteria**
- ...

**Non-Goals**
- ...
```

## Hard Rules

- Do not edit source code.
- Do not edit `.beans/*.md` directly.
- Do not include file paths, function names, class names, or line numbers.
- Use `beans create`.
- The heading must be exactly `## High-Level Plan`.

## Test

```bash
cd sandbox
claude
> /planner Add parentheses support to the calculator
```

Inspect:

```bash
beans list
beans show <new-id>
```

Reference solution:

```text
solution/.claude/skills/planner/SKILL.md
```
