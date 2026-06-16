# Red-team inputs

Feed each to the factory and watch the station. An "escape" is a station that continues instead
of aborting, or bad output that slips past your 02 check.

| # | Bad input | How to trigger | Fails loudly = |
| - | --------- | -------------- | -------------- |
| 1 | Vague feature request | `/planner make it better` | planner asks a clarifying question, does not invent a plan |
| 2 | Missing `## High-Level Plan` | `/refine` a bean with no plan section | refine aborts and tells you to run `/planner` |
| 3 | Hallucinated file path | refine/implement a bean naming a file that does not exist | the path is caught (your 02 check FAILS, or implement stops) |
| 4 | Dirty working tree | `/implement` with uncommitted changes | implement refuses: working tree not clean |
| 5 | Already-completed bean | `/implement` a bean with status completed | implement refuses to re-run |

Pick ONE escape you actually find and carry it into the exercise.
