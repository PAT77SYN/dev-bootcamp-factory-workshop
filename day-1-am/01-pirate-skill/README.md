# 01 — Pirate Skill

Track: Starter / Intermediate  
Time: 25 minutes

## Goal

Build a first on-demand Skill. Contrast it with `CLAUDE.md`.

## Exercise

Create:

```text
exercise/.claude/skills/pirate-speak/SKILL.md
```

Frontmatter:

```yaml
---
name: pirate-speak
description: Rephrase text in pirate language. Use when the user asks to "piraterize", "make it pirate", "talk like a pirate", or wants text converted to pirate dialect.
---
```

In the body, define:

- vocabulary swaps
- tone markers
- what to preserve: code, URLs, file paths, identifiers
- light / medium / heavy intensity if you want a stretch

## Verify

Ask:

```text
Make this pirate: Hello team, I will update the deployment.
```

Then ask an unrelated question. The Skill should not activate for unrelated work.

## Discussion

The `description` is the activation key. A Skill is a tool in the toolbox, not a permanent personality layer.

Reference solution:

```text
solution/.claude/skills/pirate-speak/SKILL.md
```

