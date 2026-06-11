# 03 — Subagent

Track: Advanced  
Time: 30 minutes

## Goal

Build a subagent that performs read-heavy work in an isolated context and returns a compact structured summary.

## Exercise

Create:

```text
exercise/.claude/agents/codebase-explorer.md
```

Frontmatter:

```yaml
---
name: codebase-explorer
description: Use when the user wants to understand where a concept lives in the codebase.
tools: Read, Grep, Glob, Bash
model: claude-sonnet-4-6
---
```

Body requirements:

- read-only role
- workflow for locating relevant files
- output contract under 400 words
- no edits, no builds, no tests unless explicitly allowed

Suggested output:

```markdown
## Summary

## Relevant Files

## Integration Points

## Open Questions
```

## Verify

Invoke the subagent from a Claude Code session and ask it to locate where calculator parsing happens in `sandbox/`.

## Discussion

Subagents protect the main context from long exploration transcripts. In the afternoon, `/refine` uses this idea to explore the codebase before writing a concrete plan.

Reference solutions:

```text
solution/.claude/agents/codebase-explorer.md
solution/.claude/agents/pr-diff-summarizer.md
```

