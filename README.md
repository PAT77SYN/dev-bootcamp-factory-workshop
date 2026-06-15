# Dev Bootcamp Factory Workshop Exercises

English exercise repo for a shortened factory-building workshop with mixed participant experience.

The room is diverse: some participants may be creating their first Skill, while others have already built many Skills and want deeper material. This repo is therefore intentionally structured as a **menu**, not a strict linear curriculum. There are more exercises than fit into the morning.

The afternoon still works even if participants do not complete the advanced morning exercises, because the factory has a supplied baseline.

## Workshop Shape

```text
Day 1 AM   Mechanism menu: CLAUDE.md, Skills, Rules, Subagents, Planning Skill
Day 1 PM   Common factory spine: planner -> refine -> supplied implement
Day 2 AM   Evals / AI retrospective / factory improvement
```

## Core Principle

Morning exercises teach mechanisms independently:

| Mechanism | Loads when | Best for |
| --- | --- | --- |
| `CLAUDE.md` | Always-on for a project/session | Project norms, architecture notes, persistent behavior |
| Skill | On-demand by task match or command | Repeatable workflows such as planning, review, migration |
| Rule | Scoped by file glob | File-type or folder-specific conventions |
| Subagent | Delegated isolated context | Read-heavy exploration, summaries, specialized checks |
| Hook | Deterministic tool-event command | Guardrails, validation, state priming |

The afternoon connects them through one common factory pattern:

```text
Input idea
  -> planning artifact
  -> refinement step
  -> supplied implementation / demo
```

The main lesson: a team can define its own factory stages and enforce hand-offs through durable artifacts and exact contracts.

## Day 1 AM — Two Tracks, One Menu

Start with a shared 10-minute kickoff:

1. Explain the mechanism ladder.
2. Show the exercise menu.
3. Say explicitly: "You are not expected to finish everything."
4. Goal: end the morning understanding how a workflow produces an artifact.

### Track A — Starter / Intermediate

For people who have never built a Skill or are still sorting out licenses/tooling.

1. [00 Pirate CLAUDE.md](day-1-am/00-pirate-claude-md/README.md), 15 min
2. [01 Pirate Skill](day-1-am/01-pirate-skill/README.md), 25 min
3. [04 Planning Skill](day-1-am/04-planning-skill/README.md), 35 min

Expected outcome: participants understand Skills and have seen artifact output.

### Track B — Advanced

For people who already know Skills.

1. [02 Rules](day-1-am/02-rules/README.md), 20 min
2. [03 Subagent](day-1-am/03-subagent/README.md), 30 min
3. [04 Planning Skill](day-1-am/04-planning-skill/README.md), 30 min as an upgrade exercise

Optional stretch: add a Hook guardrail if someone is fast.

Expected outcome: participants understand factory ingredients beyond basic Skills.

See [day-1-am](day-1-am/README.md).

## Day 1 PM — Common Factory Spine

The afternoon starts from a common baseline. Participants can use supplied assets if their morning work is incomplete.

Factory contract:

```text
/planner <idea>
  -> Bean with ## High-Level Plan

/refine <bean-id>
  -> same Bean with ## Refined Plan

/implement <bean-id>
  -> branch, commits, implementation log
```

Exercise choices:

| Level | Path |
| --- | --- |
| Level 1 | Run supplied `/planner` and `/refine`, inspect the Bean |
| Level 2 | Replace supplied `/planner` with your own morning planner |
| Level 3 | Improve `/refine` using a subagent and stricter validation |

The implementation station is supplied. Trainers can demo it after participants understand the hand-off.

See [day-1-pm](day-1-pm/README.md).

## Day 2 AM — Evals and Retrospective

The second morning treats the factory as the object under evaluation:

- Did the artifacts contain the right information?
- Did each station stay within its boundary?
- Did the factory fail loudly when the input was bad?
- What should be checked by prompt instruction, Rule, Hook, script, or human review?

See [day-2-am](day-2-am/README.md).

## Repository Structure

```text
day-1-am/
  00-pirate-claude-md/
  01-pirate-skill/
  02-rules/
  03-subagent/
  04-planning-skill/
  README.md

day-1-pm/
  01-factory-contract/
  02-planner-to-bean/
  03-refine-bean/
  README.md

day-2-am/
  README.md

sandbox/
  Small TypeScript calculator codebase used by the factory

supplied/
  planner/
  refine/
  implement/
  seeded-beans/
```

## Setup

Participants need:

- Claude Code
- `beans` CLI
- `jq`
- Node.js >= 20
- `npm`
- `git`

Beans CLI:

```bash
brew install hmans/beans/beans
beans --version
```

Build the sandbox:

```bash
cd sandbox
npm install
npm run build
npm test
```

