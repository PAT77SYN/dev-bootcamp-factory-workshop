---
glob: "**/*.{cpp,h,hpp}"
---

# Modern C++ Konventionen

Enforce these when working with C++ source or headers.

## Memory & Pointers

- `nullptr` instead of `NULL` or `0` for pointer literals
- Prefer smart pointers (`std::unique_ptr`, `std::shared_ptr`) — no raw `new`/`delete` in application code
- If raw pointer is needed (interop, non-owning observer): mark with `// non-owning:` comment

## Type Inference

- `auto` for iterator types and complex template instantiations
- Explicit types for primitives and short-lived locals — readability over brevity

## Class Design

- Rule-of-Five: if you declare any one of destructor / copy ctor / copy assign / move ctor / move assign, declare or `= default` / `= delete` all five
- `explicit` on single-argument constructors unless implicit conversion is the intent

## Modern Idioms

- Range-based `for` over index loops when no index needed
- `constexpr` where possible — push work to compile-time
- `std::string_view` for read-only string parameters
