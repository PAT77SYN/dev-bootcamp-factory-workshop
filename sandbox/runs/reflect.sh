#!/usr/bin/env python3
"""
reflect.sh — analyze runs/trace.jsonl + runs/tool-outcomes.jsonl and print a
self-improvement report grouped by session.

Usage:
  python3 runs/reflect.sh           # all sessions
  python3 runs/reflect.sh <session> # single session
"""
import json, sys, collections, pathlib, datetime

ROOT = pathlib.Path(__file__).parent

def load_jsonl(path):
    if not path.exists():
        return []
    records = []
    for line in path.read_text().splitlines():
        try:
            records.append(json.loads(line))
        except Exception:
            pass
    return records

traces   = load_jsonl(ROOT / "trace.jsonl")
outcomes = load_jsonl(ROOT / "tool-outcomes.jsonl")

filter_session = sys.argv[1] if len(sys.argv) > 1 else None

# Group traces by session
sessions = collections.defaultdict(list)
for t in traces:
    sessions[t.get("session", "unknown")].append(t)

# Group outcomes by session
out_by_session = collections.defaultdict(list)
for o in outcomes:
    out_by_session[o.get("session", "unknown")].append(o)

def fmt_dt(s):
    try:
        return datetime.datetime.fromisoformat(s.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M")
    except Exception:
        return s

print("=" * 70)
print("  REFLECTION REPORT")
print("=" * 70)

for sid, turns_list in sorted(sessions.items(), key=lambda x: x[1][0].get("at", "")):
    if filter_session and filter_session not in sid:
        continue

    turns_list.sort(key=lambda t: t.get("at", ""))
    first = turns_list[0]
    last  = turns_list[-1]
    n_turns = last.get("turns", len(turns_list))
    bean    = last.get("bean", "none")
    branch  = last.get("branch", "unknown")
    commits = int(last.get("commits", 0)) - int(first.get("commits", 0))
    transcript = first.get("transcript", "")

    outs = out_by_session.get(sid, [])
    builds = [o for o in outs if "build" in o.get("cmd", "")]
    tests  = [o for o in outs if "test"  in o.get("cmd", "")]
    build_fails = [o for o in builds if o.get("outcome") == "fail"]
    test_fails  = [o for o in tests  if o.get("outcome") == "fail"]

    print(f"\nSession: {sid[:16]}…")
    print(f"  Bean    : {bean}")
    print(f"  Branch  : {branch}")
    print(f"  Start   : {fmt_dt(first.get('at','?'))}  →  End: {fmt_dt(last.get('at','?'))}")
    print(f"  Turns   : {n_turns}   Commits: {commits}")
    print(f"  Builds  : {len(builds)} total  ({len(build_fails)} failed)")
    print(f"  Tests   : {len(tests)} total  ({len(test_fails)} failed)")

    if build_fails:
        print("  Build failures:")
        for f in build_fails:
            err = (f.get("first_error") or "").strip()
            print(f"    [{fmt_dt(f.get('at','?'))}] {err[:80]}")

    if test_fails:
        print("  Test failures:")
        for f in test_fails:
            err = (f.get("first_error") or "").strip()
            print(f"    [{fmt_dt(f.get('at','?'))}] {err[:80]}")

    if transcript:
        print(f"  Transcript: {transcript}")

print("\n" + "=" * 70)
print(f"  {len(sessions)} session(s) analyzed")
print("=" * 70)
