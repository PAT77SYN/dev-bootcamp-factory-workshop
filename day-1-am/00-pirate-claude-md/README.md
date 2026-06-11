# 00 — Pirate CLAUDE.md

Track: Starter / Intermediate  
Time: 15 minutes

## Goal

Understand how `CLAUDE.md` changes behavior as always-on project context.

## Exercise

1. Open `exercise/`.
2. Start Claude Code.
3. Ask: "Tell me a short story about a pirate."
4. Stop the session.
5. Create `exercise/CLAUDE.md`:

   ```markdown
   Always answer like a pirate. Start every answer with "Arrr".
   ```

6. Restart Claude Code in `exercise/`.
7. Ask the same question again.

## Verify

- The answer now follows the local `CLAUDE.md`.
- The behavior is always-on, not triggered by a command.
- Restarting the session matters because project context is loaded at session start.

## Discussion

`CLAUDE.md` is good for persistent project norms. It is not the right mechanism for optional workflows.

Reference solution:

```text
solution/CLAUDE.md
```

