# 02 - Test it (evals)

Time: 35 minutes

See it, then test it. The factory's output is a bean - a plan plus a log. An eval asks "is this
bean trustworthy?" and answers PASS or FAIL. You write the evals; we provide the checker and a
good bean and a broken bean to test them against.

## Setup

Copy the eval kit into your sandbox, from `sandbox/`:

```bash
cp -R ../day-2-am/02-evals/eval-kit .
```

Run the checker on the good bean, then the broken one:

```bash
bash eval-kit/check.sh eval-kit/beans/good-bean.md
bash eval-kit/check.sh eval-kit/beans/broken-bean.md
```

The good bean passes every check. The broken bean should fail at least one - that is what tells
you an eval is doing its job.

## Part 1 - write a couple of evals

Open `eval-kit/check.sh`. Each eval is one line: a condition that prints PASS or FAIL. The two
seeded checks are right there to copy. Add two of your own under "your turn", aimed at real
factory failure modes:

- the acceptance criteria are not a placeholder like "it works" (there is an idea to uncomment)
- every path under "Files to change" actually exists - no hallucinated files (loop the paths and
  test each with `[ -e "$p" ]`, run from the sandbox)

Run it on both beans again. A useful eval PASSES the good bean and FAILS the broken one. If it
passes both, it is not catching anything - sharpen it.

## Part 2 - a judge (for what a line of bash cannot see)

Some quality is subjective - "are the acceptance criteria measurable?" - and no grep catches it.
So write the eval in plain English and have your agent judge it.

1. Write a criterion, e.g. "The acceptance criteria are specific and measurable, not vague."
2. Ask your agent: "Read eval-kit/beans/good-bean.md and judge PASS or FAIL against this
   criterion, with one line of reasoning." Then do the same for `broken-bean.md`.
3. Validate the judge: it should PASS the good bean and FAIL the broken one. If it cannot tell
   them apart, your criterion is too loose. An unvalidated judge is a vibe.

Keep the judge independent of the work it grades: run it as a subagent (its own context, not the
session that wrote the bean), and if you have access to more than one model, point it at a
different one - so the judge's blind spots do not match the writer's.

## Stretch - let the agent draft, you curate

Ask your agent to propose five more checks. Run them on both beans. Keep only the ones that pass
the good bean and fail the broken one - the agent will write some that pass everything. Curating,
not generating, is the eval skill.

## From eval to guard

You ran these evals by hand to learn what a good one looks like. In `03` you take one and wire it
into the factory so it runs automatically, every time - that is the loop.

## Reflection

Which failure mode would hurt your real factory most, and do you have an eval that catches it?
