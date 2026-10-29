# Iteration Log: Linter/Type-Checker Summary Task

Each row is one agent run against the workflow in [`docs/prd.md`](prd.md), scored with [`docs/rubric.md`](rubric.md).

> **Note on cost tracking:** Runs R-01 through R-03 were executed without `--output-format json`, so per-run token counts and cost are unavailable and marked `n/a`. Starting with R-04, runs use `claude -p "..." --output-format json`, which returns `total_cost_usd` and a per-model token breakdown, captured directly in this log going forward.

## How to fill in each field

| Field | What to record |
|---|---|
| Run ID | `R-01`, `R-02`, and so on, in order. Never reuse an ID. |
| Date | `YYYY-MM-DD` |
| Agent/tool | Tool and model, e.g. `Claude Code / claude-opus-5-5` |
| Prompt or command | The prompt text or command, or a link to a file holding it if it's long |
| Cycle time | From starting the run to the agent finishing, in minutes |
| D1–D3 | Rubric score 1–4 for Execution Completeness, Permission/Blocker Transparency, and Error Reporting Granularity |
| D4 | Scope Discipline: `Pass` or `Fail` |
| D5 | Result Accuracy: `Pass` or `Fail` |
| Total | Sum of D1–D3, out of 12 |
| Score notes | One short reason for any score below 3, or for a 4 |
| Result | `PASS` if D4 and D5 are both Pass and D1–D3 are each 3 or higher. Otherwise `FAIL`. |
| Review latency | From the agent finishing to the human review decision, in minutes |
| Cost | Cost in USD, plus input/output tokens if available. Write `n/a` if unknown. |
| Observations | What worked, what failed, and what changed since the previous run |

## Runs

| Run ID | Date | Agent/tool | Prompt or command | Cycle time (min) | D1 | D2 | D3 | D4 | D5 | Total /12 | Score notes | Result | Review latency (min) | Cost (USD, tokens in/out) | Observations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-01 | 2026-10-28 | Claude Code / claude-opus-5-5 | `claude -p "Run the project's linter or type checker and summarize the results"` | 0.37 | 1 | 3 | 1 | Pass | Pass | 5 | D1: neither check executed (both blocked). D3: no errors to report since nothing ran. | FAIL | n/a | n/a | No permissions pre-approved. Every command was blocked pending approval, which non-interactive mode cannot grant. Agent correctly explained exactly which commands and permissions were needed (D2 met), and made no file changes. |
| R-02 | 2026-10-28 | Claude Code / claude-opus-5-5 | `claude -p "Run the project's linter or type checker and summarize the results"` | 0.40 | 2 | 3 | 1 | Pass | Pass | 6 | D1: only type-check completed, lint still blocked. D3: no lint errors to report since lint never ran. | FAIL | n/a | n/a | Added `Bash(npm run lint:*)` and `Bash(npx tsc:*)`. Type-check succeeded (app, spec, e2e configs, no errors). Lint still blocked: agent invoked `ng lint`/`tslint` directly, which didn't match the `npm run lint` permission pattern. Agent again clearly explained the blocker and fix (D2 met). |
| R-03 | 2026-10-28 | Claude Code / claude-opus-5-5 | `claude -p "Run the project's linter or type checker and summarize the results"` | 0.36 | 4 | 4 | 3 | Pass | Pass | 11 | D1 exceeds: ran both checks plus confirmed no changes needed. D3: errors reported by file, rule, and line, but not grouped by severity/fix complexity (would need that for a 4). | PASS | n/a | n/a | Added `Bash(ng lint:*)`, `Bash(npx ng lint:*)`, `Bash(npx tslint:*)`. Full success: type-check passed cleanly; lint found 12 real TSLint errors across 2 files, each with file/rule/line detail (prefer-const ×6, no-shadowed-variable, comment-format ×2, max-line-length, no-trailing-whitespace, missing EOF newline). Agent made no file changes, offered to fix if asked. Fastest and most complete run of the first three — confirms the R-02 permission fix was correct. Cost/token data not captured — see note above. |
| R-04 | 2026-10-28 | Claude Code / claude-opus-5-5 | `claude -p "Run the project's linter or type checker and summarize the results" --output-format json` | 0.42 | 4 | 3 | 3 | Pass | Pass | 10 | D1 exceeds: both checks completed and the agent adapted smoothly when an exploratory command was denied, without stalling. D2 meets but doesn't exceed: the permission denial wasn't surfaced in the final user-facing summary, only visible in the raw JSON's `permission_denials` field. D3: errors reported by file, rule, and line; results matched R-03 almost exactly. | PASS | n/a | $0.24 (12 in / 1,665 out; 21,968 cache-creation; 170,679 cache-read) | First run with `--output-format json`, capturing real cost/token data. Results consistent with R-03: type-check clean, same 12 TSLint errors identified with identical file/rule/line detail. One exploratory command (`cat package.json && ls node_modules/.bin...`) was denied under current permissions; the agent silently fell back to its already-permitted commands and completed successfully, but didn't mention the denial/fallback in its summary — a minor transparency gap worth tightening. |
