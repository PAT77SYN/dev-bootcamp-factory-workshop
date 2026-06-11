# Supplied Factory Parts

Use these assets to keep the afternoon working for everyone.

Participants can build or improve their own versions, but nobody is blocked if they did not complete the advanced morning exercises.

## Supplied Planner

```text
planner/.claude/skills/planner/SKILL.md
```

Creates a Bean with `## High-Level Plan`.

## Supplied Refine

```text
refine/.claude/skills/refine/SKILL.md
```

Reads `## High-Level Plan` and appends `## Refined Plan`.

## Supplied Implement

```text
implement/.claude/skills/implement/SKILL.md
```

Reads `## Refined Plan`, creates a feature branch, edits/builds/tests/commits, and logs implementation status back to the Bean.

## Seeded Beans

```text
seeded-beans/refine-ready/
seeded-beans/implement-ready/
```

Use these if the room needs a fast reset point.

Example:

```bash
rm -rf sandbox/.beans
cp -R supplied/seeded-beans/refine-ready sandbox/.beans
```

## Copying Supplied Skills

Planner:

```bash
cp -R supplied/planner/.claude/. sandbox/.claude/
```

Refine:

```bash
cp -R supplied/refine/.claude/. sandbox/.claude/
```

Implement:

```bash
cp -R supplied/implement/.claude/. sandbox/.claude/
```

