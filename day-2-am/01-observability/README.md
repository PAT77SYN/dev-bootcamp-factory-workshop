# 01 - See it (observability)

Time: 30 minutes

Trace the run. A factory you cannot see is a factory you cannot trust (talk: "trace the run,
three layers").

## Goal

Feel the difference observability makes. Run the factory with no record, then with one, and
compare what is left behind.

## First, without the hook

Run a station and watch the run scroll away. From `sandbox/`:

- run something, e.g. `/implement sandbox-exercise-olqc` (or `/refine sandbox-vzwt`)
- when it finishes, ask: what durable record of that run exists? The bean holds the plan and
  the log; everything else - which tools ran, what it tried, whether tests passed along the way
  - is gone once the transcript scrolls.

Three layers of a run: artifacts (partly captured, in the bean), execution (lost), conversation
(lost).

## Then, with the hook

We ship a working trace hook. Install it, from `sandbox/`:

```bash
cp ../day-2-am/01-observability/hook/settings.json .claude/settings.json
mkdir -p .claude/hooks
cp ../day-2-am/01-observability/hook/trace-run.sh .claude/hooks/trace-run.sh
```

Restart your Claude session so the hook loads (exit, then run `claude` again - settings are read
at startup). Now run a station again, then look:

```bash
cat runs/trace.jsonl
```

Each run now leaves a line: timestamp, branch, files changed, commit count.

## Compare

- What can you see now that you could not before?
- Which of the three layers did the hook capture, and which is still missing?
- Open `.claude/hooks/trace-run.sh` - it is a handful of lines. What one field would you add for
  your team's factory?

## Reflection

What is invisible when a run goes wrong, and which layer would you most want back?
