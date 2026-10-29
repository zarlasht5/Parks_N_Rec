# Iteration Log: Build Command Success Check

Each row is one agent run against the task in [`docs/prd.md`](prd.md), scored with [`docs/rubric.md`](rubric.md).

## How to fill in each field

| Field | What to record |
|---|---|
| Run ID | `B-01`, `B-02`, and so on, in order. Never reuse an ID. |
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
| B-01 | 2026-10-28 | Claude Code / claude-opus-5-5 | `claude -p "Run \`npm run build\`... Save the summary to \`docs/build-report.md\`. Do not attempt to fix any build errors. Do not modify any source files." --output-format json` | 0.22 | 1 | 4 | 1 | Pass | Pass | 6 | D1: build blocked entirely, no pre-approved permission. D3: nothing to report since nothing ran. | FAIL | n/a | $0.05 (8 in / 923 out; 1,197 cache-creation; 117,248 cache-read) | Baseline run. Agent correctly refused to fabricate a result or circumvent the block, explained exactly what was needed, and offered an unconfirmed hypothesis clearly labeled as speculation. |
| B-02 | 2026-10-28 | Claude Code / claude-opus-5-5 | Same prompt, after adding `Bash(npm run build:*)` | 0.46 | 3 | 4 | 4 | Fail | Pass | 11 | D4 fails: build ran and failed correctly, diagnosis was excellent (exact root cause, correctly separated real errors from noise), but the report file could not be written — permission denied. | FAIL | n/a | $0.10 (14 in / 2,255 out; 2,727 cache-creation; 212,681 cache-read) | Build correctly diagnosed: `ERR_OSSL_EVP_UNSUPPORTED`, Node 22 vs. Angular 7/webpack 4 incompatibility (same root cause found independently earlier in this project). Agent gave full report text in its response as a fallback when the file write was denied. |
| B-03 | 2026-10-28 | Claude Code / claude-opus-5-5 | Same prompt, after adding `Write(docs/*)` | 0.59 | 3 | 4 | 4 | Fail | Pass | 11 | Same as B-02 — write still denied despite broadened permission pattern. Diagnosis remained excellent and consistent across both attempts. | FAIL | n/a | $0.13 (14 in / 3,246 out; 2,727 cache-creation; 212,681 cache-read) | Write permission pattern did not resolve the denial after two attempts with different syntax. Report content was manually saved by the human from the agent's output text, since the agent could not write it itself. Documents a real limitation: file-write permission patterns were harder to get right than command permission patterns in this environment. |
