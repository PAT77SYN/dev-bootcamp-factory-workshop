# 01 — Factory Contract

Time: 15 minutes

## Goal

Make the step-to-step glue visible before participants build or run anything.

## Contract

```text
Feature idea
  -> /planner <idea>
  -> Bean with ## High-Level Plan
  -> /refine <bean-id>
  -> same Bean with ## Refined Plan
  -> /implement <bean-id>
  -> branch, commits, implementation log
```

## Explain

The factory does not work because one huge prompt remembers everything.

It works because each station has:

- an input
- an output
- a stable artifact
- a boundary
- a hand-off contract

## Inspect a Bean

From `sandbox/`:

```bash
beans list
beans show sandbox-exercise-olqc
```

Look for:

- title
- status
- body
- `## High-Level Plan`
- `## Refined Plan`, if present

## Discussion

Ask:

- What exact text does the next station depend on?
- What happens if the heading is renamed?
- Which data belongs in the Bean?
- Which data should stay out of the Bean?

