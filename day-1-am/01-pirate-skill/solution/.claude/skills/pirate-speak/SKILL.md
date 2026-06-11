---
name: pirate-speak
description: Rephrase text in pirate language. Use this skill whenever the user asks to "piraterize", "make it pirate", "rephrase in pirate", "talk like a pirate", "pirate-speak", "pirate voice", or wants any text converted to pirate dialect. Also trigger when user wants to replace/rewrite existing text in a pirate style, whether in a file, message, document, or selection. Use even if the user does not explicitly say "skill" — any request involving pirate-style rewriting should invoke this.
---

# Pirate Speak

Convert ordinary text into pirate dialect while preserving meaning, structure, and any technical content.

## When to use

- User says: "piraterize", "make it pirate", "rephrase in pirate", "talk like pirate", "in pirate", "pirate version".
- User asks to replace text in a file with a pirate version.
- User wants chat output, docs, comments, or any string converted to pirate.

## Core transformation rules

Preserve meaning first. Pirate flavor second. Never break technical accuracy.

### Vocabulary swaps

| Normal | Pirate |
|--------|--------|
| hello / hi | ahoy |
| yes | aye |
| no | nay |
| my | me |
| friend | matey / hearty |
| friends | mateys / hearties |
| you | ye |
| your | yer |
| are | be |
| is | be |
| am | be |
| the | th' |
| of | o' |
| over | o'er |
| stop | belay |
| look | lookee |
| money | doubloons / pieces o' eight |
| food | grub |
| drink | grog |
| boss | cap'n |
| manager | first mate |
| team | crew |
| office | ship |
| company | fleet |
| computer | contraption |
| problem | trouble on th' high seas |
| good | fine |
| great | grand |
| bad | scurvy |
| very | mighty |
| woman | lass |
| man | lad |
| children | younglings |
| treasure | booty |
| death | Davy Jones' locker |

### Interjections (sprinkle naturally, do not overuse)

- "Arr!" / "Arrr!"
- "Yarr!"
- "Shiver me timbers!"
- "Avast!"
- "Blimey!"
- "Yo ho ho!"
- "Ahoy!"
- "Batten down th' hatches!"

Use 1 interjection per 2-4 sentences. More feels parody. Less feels weak.

### Grammar shifts

- Drop final `g` in `-ing` words: "sailing" → "sailin'"
- "have to" → "must"
- "going to" → "be off to" / "settin' sail to"
- "want to" → "be wantin' to"
- "I have" → "I've got" / "I be havin'"

### Sentence flavor

End statements with pirate tags occasionally:
- "...savvy?"
- "...ye scallywag."
- "...by th' powers!"
- "...or I'll keelhaul ye."

## What to preserve unchanged

- Code blocks, code identifiers, file paths, URLs, command names.
- Quoted strings the user marked literal.
- Numbers, dates, units.
- Proper nouns (unless user asks otherwise).
- Markdown structure (headings, lists, links).

## Examples

**Example 1**
Input: `Hello team, I want to update the deployment script before tomorrow's meeting.`
Output: `Ahoy crew! I be wantin' to update th' deployment script afore tomorrow's gatherin', savvy?`

**Example 2**
Input: `The function returns null when the user is not found.`
Output: `Th' function returns null when th' user be not found, ye scallywag.`

(Note: `null` and `function` kept intact — technical terms.)

**Example 3**
Input: `Please review my pull request and let me know if you have feedback.`
Output: `Arr, kindly lookee at me pull request, matey, an' send word if ye be havin' any feedback.`

**Example 4 (file replacement)**
User: "Piraterize README.md"
Action: Read file, transform prose paragraphs to pirate, leave code blocks / commands / URLs untouched, write back.

## Operating modes

1. **Inline rephrase** — user pastes text or quotes a string. Output the pirate version directly. No commentary.

2. **File replace** — user names a file. Read it, transform, write back. Confirm scope first if file large (>200 lines) or contains heavy code. Preserve code blocks, frontmatter, and structural markdown verbatim.

3. **Selection** — user gives chunk and says "this part". Transform only that chunk.

## Calibration

Default intensity: **medium** — readable, fun, meaning intact.

If user says "more pirate" / "heavier": add more interjections, more grammar shifts, more vocabulary swaps.
If user says "lighter" / "subtle": only swap key words (you→ye, hello→ahoy, the→th'), drop interjections.

## Anti-patterns

- Don't pirate technical terms, code, paths, identifiers.
- Don't change meaning to fit pirate flavor.
- Don't stack 3+ interjections in one sentence — sounds cartoonish.
- Don't translate already-pirate text further.
- Don't add narrator commentary like "Here's the pirate version:" unless user asked for it. Just output th' result.
