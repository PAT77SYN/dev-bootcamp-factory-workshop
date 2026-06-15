# 02 — Rules

Track: Advanced  
Time: 20 minutes

## Goal

Understand scoped behavior: a Rule is loaded when a matching file glob is in play.

## Exercise

Create:

```text
exercise/.claude/rules/pirate-markdown.md
```

Content:

```markdown
---
glob: "**/*.md"
---

When working on Markdown files, answer in pirate style.
```

Then test:

1. Ask Claude Code to edit or review a Markdown file.
2. Ask Claude Code to inspect `exercise/main.ts`.

## Verify

- Markdown work activates the pirate behavior.
- TypeScript work does not.
- The trigger is the glob scope, not a Skill description.

## Stretch

Create a second Rule for modern TypeScript conventions (glob `**/*.ts`) and test it against `exercise/main.ts`.

Reference solutions:

```text
solution/.claude/rules/pirate.md
solution/.claude/rules/ts-modern.md
```

