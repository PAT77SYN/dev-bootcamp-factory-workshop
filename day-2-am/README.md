# Day 2 AM - Instrument your factory

This block builds a miniature of the talk's three pillars on the Day-1 calculator factory: see a
run, test it, make the fix stick. Do the three exercises in order.

## Setup (10 min)

Reset to the supplied baseline so nobody is blocked on unfinished Day-1 work. From the repo root:

```bash
cd sandbox
cp -R ../supplied/planner/.claude/.   .claude/
cp -R ../supplied/refine/.claude/.    .claude/
cp -R ../supplied/implement/.claude/. .claude/
npm install && npm run build && npm test
```

The sandbox ships an implement-ready bean `sandbox-exercise-olqc`; running `/implement` on it in
01 produces a run to look at. Pods who finished Day 1 may use their own skills and beans instead.

## The three exercises (in order)

1. [01 - See it](01-observability/README.md) - make one run inspectable (observability)
2. [02 - Test it](02-evals/README.md) - write a couple of evals, validated on a good and broken bean (evals)
3. [03 - Make it stick](03-learning-loops/README.md) - turn a failure into a guard (learning loops)

You cannot eval what you cannot see, and you cannot close a loop you cannot eval - so the order
matters.

## Timeline

| Time | Segment |
| --- | --- |
| 0:00-0:10 | Setup + framing |
| 0:10-0:40 | 01 - See it |
| 0:40-1:15 | 02 - Test it |
| 1:15-1:50 | 03 - Make it stick |
| 1:50-2:00 | Reveal + show & tell prep |

## Show & tell

Each pod prepares a 90-second, one-screen story: the run you can now see, an eval you wrote that
catches a broken bean, the escape you found and the guard that makes it stick. The presenter brings it to
the 12:00 cross-pod session.

## Taking it home

The calculator is a controlled rig for learning three moves. They are the same on your real
factory - bigger golden sets, real traces, real CI - and a human still curates and decides; the
tooling gives evidence instead of vibes.

- **Observability:** put the same kind of hook on your real repo - log each agent run (tools
  used, files touched, tests, tokens/cost, pass/fail) to a file you can query. In a week you have
  data you did not have.
- **Evals:** take 10-20 real artifacts your agents produced (plans, PRs, diffs), label them
  good/bad, and write the checks that tell them apart - deterministic for structure, an
  independent judge for quality. Validate the judge before you trust it, then run them in CI.
- **Loops:** when your factory ships something wrong, add the eval that would have caught it -
  not just the fix. Re-run the suite when you change a prompt, model, or harness to see if it
  actually helped. Codify the lesson into `CLAUDE.md`.

Close by naming one move to put on your own factory first, and commit to it - that carries into
the Day 2 "Reflect & Commit" session.
