# 03 - Make it stick (learning loops)

Time: 35 minutes

Close the loop. A failure you find once should never silently recur (talk: "the loop shape",
"escapes become tests").

## Goal

Turn one failure into a permanent guard, and write the lesson down.

## Red-team

Use `starter/red-team-inputs.md`. Feed the factory bad input and watch each station. Find one
escape: a station that continues instead of aborting, or bad output that slips past your 02
check.

The supplied skills are deliberately hardened, so they may not break easily. If you built your
own planner or refine on Day 1, red-team those instead - or run the same bad input through both
and compare. Your own factory is the more honest target, and the gap between it and the supplied
one is itself worth seeing.

## Build the guard

This is where an eval stops being something you run by hand and becomes part of the process - it
runs automatically, every time the factory runs. Take the escape you found and wire a check for
it in with the right mechanism:

- a hook that blocks `/implement` when `## Refined Plan` is missing
- a rule, or a skill self-check
- a new check added to your 02 eval set, run by the station that produces the bean

Re-run the bad input and confirm it now fails loudly. (Cheap deterministic checks like these are
worth running on every step; an LLM-judge is too slow to gate every run - that kind you run
offline across many beans, which is what the grown-up version does.)

## Codify

Add one line to the factory's `CLAUDE.md` or conventions so the lesson persists. Fill in the
"how we'll know it worked" card: name the check and the signal you will watch.

## Verify

- the bad input that escaped now fails loudly
- the lesson is written down

## Reflection

Prompt vs rule vs hook vs script vs human - which mechanism did you pick, and why?

Short on time? The smallest possible loop closure is to add a check to your 02 eval set that catches it.
