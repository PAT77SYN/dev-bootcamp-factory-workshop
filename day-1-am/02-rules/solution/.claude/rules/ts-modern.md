---
glob: "**/*.ts"
---

# Modern TypeScript Konventionen

Enforce these when working with TypeScript source.

## Variablen-Deklarationen

- `const` by default, `let` only when the binding is actually reassigned
- Never `var` — it ignores block scope and hoists unexpectedly

## Equality

- `===` / `!==` instead of `==` / `!=` — no implicit type coercion
- Use explicit nullish checks (`value === null`, `value === undefined`, `value == null` only when intentional)

## Typen

- Avoid `any` — prefer precise types; use `unknown` at untrusted boundaries and narrow before use
- Annotate function signatures (parameters and return types) — no implicit `any` on params

## Iteration

- `for...of` or array methods (`map`, `filter`, `reduce`) over C-style index loops when the index isn't needed
- Reach for the index only when you genuinely need it

## Immutability

- Prefer `readonly` properties and immutable data where practical
- Treat inputs as immutable; return new values rather than mutating in place

## Module

- ESM `import` / `export`, no CommonJS `require`
- Explicit `.js` extensions on relative imports (NodeNext resolution)
