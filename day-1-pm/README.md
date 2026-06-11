# Day 1 PM — Common Factory Spine

The afternoon must work even if participants did not complete the advanced morning exercises.

So the afternoon starts from a common baseline:

- supplied planner
- supplied refine
- supplied implement
- pre-seeded Beans

Participants can replace supplied parts with their own work if they are ready.

## Factory Contract

```text
/planner <idea>
  -> Bean with ## High-Level Plan

/refine <bean-id>
  -> same Bean with ## Refined Plan

/implement <bean-id>
  -> branch, commits, implementation log
```

The glue is not magic. It is the contract:

- Bean ID is passed between stations.
- `/planner` writes exact heading `## High-Level Plan`.
- `/refine` reads exact heading `## High-Level Plan`.
- `/refine` writes exact heading `## Refined Plan`.
- `/implement` reads exact heading `## Refined Plan`.

## Suggested Timing

| Segment | Time | Activity |
| --- | ---: | --- |
| Common explanation | 15 min | Explain the factory contract |
| Exercise choice | 50-60 min | Pick Level 1, 2, or 3 |
| Implement demo | 15-20 min | Trainer runs supplied `/implement` |
| Debrief | 10 min | Discuss what glued the factory together |

## Exercise Levels

### Level 1 — Run the Supplied Factory

Use supplied `/planner` and `/refine`. Inspect the Bean after each step.

Best for participants who spent the morning on beginner exercises or tooling.

### Level 2 — Replace Planner

Adapt your morning planning Skill into `/planner` so it creates a Bean with `## High-Level Plan`.

Best for participants who completed the planning Skill.

### Level 3 — Improve Refine

Improve `/refine` using a read-only subagent, stricter validation, and better file-level planning.

Best for advanced participants.

## Exercises

1. [01 Factory Contract](01-factory-contract/README.md)
2. [02 Planner to Bean](02-planner-to-bean/README.md)
3. [03 Refine Bean](03-refine-bean/README.md)

## Supplied Fallbacks

```text
../supplied/planner/
../supplied/refine/
../supplied/implement/
../supplied/seeded-beans/
```

Use these to keep the whole room moving.
