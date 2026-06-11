# Day 2 AM — Evals and Factory Retrospective

This block treats the Day 1 factory as the object under evaluation.

The group has seen or built:

```text
/planner -> ## High-Level Plan
/refine  -> ## Refined Plan
/implement supplied -> branch, commits, implementation log
```

Now inspect whether the factory is reliable enough to trust.

## Evaluation Angles

### Output Quality

- Is the high-level plan at the right abstraction level?
- Are acceptance criteria measurable?
- Does the refined plan name real files and realistic signatures?
- Does the test sketch cover happy path, edge case, and regression behavior?

### Contract Quality

- Are the headings exact and easy to parse?
- Is the Bean body schema stable enough?
- Where could a Skill silently produce unusable output?
- Which fields should be mandatory?

### Safety

- Does planner avoid implementation details?
- Does refine avoid source edits?
- Does implement refuse to run on a dirty tree?
- Does implement avoid committing on `main`?
- Are failure states logged clearly?

### Team Fit

- Would this factory match the team's real workflow?
- Which station is missing?
- Which station is too heavy?
- What would be reviewed by a human?
- What should be automated?

## Exercise A — Retrospective Scorecard

Review one Bean produced on Day 1 and score it from 1-5:

| Area | Score | Evidence |
| --- | ---: | --- |
| High-level plan clarity | | |
| Acceptance criteria | | |
| Refined plan correctness | | |
| Test sketch quality | | |
| Safety boundaries | | |
| Hand-off readiness | | |

Then choose one factory improvement.

## Exercise B — Lightweight Eval

Create a checklist or script that validates a Bean before `/implement` may run.

Minimum checks:

- body contains `## High-Level Plan`
- body contains `## Refined Plan`
- refined plan contains `### Files to change`
- existing file paths exist
- no direct `.beans/*.md` edits are present in `git status`

Discussion point: should this be a Skill self-check, a Rule, a Hook, a script, or human review?

## Exercise C — Red-Team the Factory

Give the factory bad input:

- vague feature request
- missing `## High-Level Plan`
- hallucinated file path
- dirty working tree
- already completed Bean

Observe whether the station aborts cleanly or continues dangerously.

## Closing Point

A factory is not done when it completes a happy path. It is useful when the team can inspect its artifacts, evaluate its failure modes, and deliberately improve the stations.

