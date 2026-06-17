---
# sandbox-1e0y
title: 'Team takeaway: 1-pager workshop reference doc'
status: in-progress
type: task
priority: normal
created_at: 2026-06-17T10:10:48Z
updated_at: 2026-06-17T10:13:54Z
---

The bootcamp workshop produced a factory pipeline, a calculator sandbox, an eval
kit, and a self-improvement trace system. New team members and those who missed
the session have no single place to understand what was built, why, and how to
use it. This task generates a structured 1-pager MD that can be consumed as a
reference and used as raw material for an agentic presentation generator.

**Hinweise:**
- Audience: developers — attendees who want a reference and new folks who missed the session.
- Structure: layered with journey — orientation → story of what was built (in order) → component details → get-started checklist.
- Each component section must be self-contained: what it is, how it fits, how to use it.
- Presentation-friendly: each section should map cleanly to one slide.
- 1-pager spirit: no section exceeds ~200 words; total doc readable in under 5 minutes.

## High-Level Plan

**Approach** — Scan the full repo to extract the concepts, components, and relationships,
then write a single MD file following the layered-journey structure: a 3-sentence
orientation, a narrative "what we built and why" section covering the session in
chronological order, per-component reference sections, and a get-started checklist.
The file is committed to the repo and pushed to the fork.

**Steps**
- Scan the repo: workshop exercise dirs, sandbox source, beans, skills, eval-kit, trace hooks
- Draft the orientation (3 sentences: problem → approach → outcome)
- Write the journey section (chronological: calculator → factory pipeline → eval kit → trace/self-improvement)
- Write per-component reference sections (what it is, key pieces, how to use)
- Write the get-started checklist (prereqs + first commands)
- Commit and push to fork

**Acceptance Criteria**
- A single MD file exists at `docs/TAKEAWAY.md`
- Contains all four layers: orientation, journey, components, get-started checklist
- Each component section includes: what it is, its role in the system, and at least one concrete usage example
- Doc reads linearly for newcomers and is skimmable as a reference
- Every claim in the doc is grounded in actual repo content (no invented features)

**Non-Goals**
- Generating the presentation itself
- Per-function API documentation
- Deep code walkthroughs
- Coverage of unfinished or scrapped beans

## Refined Plan

### Files to change
- docs/TAKEAWAY.md:NEW — single 1-pager in layered-journey structure: orientation (3 sentences) → journey (4 components in build order) → per-component reference sections (what/key files/how-to-use) → get-started checklist; sourced entirely from verified repo content

### New signatures
- (none) — documentation task; no source functions

### Test sketch
- orientation_present — doc contains exactly one H1 and a 3-sentence intro paragraph
- all_four_layers — doc contains headings: orientation/intro, journey, each of the 4 components, get-started
- each_component_has_usage — each component section contains at least one fenced code block with an actual command
- no_invented_content — every command in the doc is runnable against the actual repo (npm install, npm run build, npm test, /planner, /refine, /implement, bash eval-kit/check.sh, python3 runs/reflect.sh)
- newcomer_readable — doc can be read start-to-finish without prior context and makes sense
