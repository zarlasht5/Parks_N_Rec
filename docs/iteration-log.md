# Iteration Log: ZIP-Code Park Search

Each row is one agent run against the workflow in [`docs/prd.md`](prd.md), scored with [`docs/rubric.md`](rubric.md).

## How to fill in each field

| Field | What to record |
|---|---|
| Run ID | `R-01`, `R-02`, and so on, in order. Never reuse an ID. |
| Date | `YYYY-MM-DD` |
| Agent/tool | Tool and model, e.g. `Claude Code / claude-opus-5-5` |
| Prompt or command | The prompt text or command, or a link to a file holding it if it's long |
| Cycle time | From starting the run to the agent finishing, in minutes |
| D1–D4 | Rubric score 1–4 for Input gating, API requests, Results display and Failure handling |
| D5 | Key safety: `Pass` or `Fail` |
| Total | Sum of D1–D4, out of 16 |
| Score notes | One short reason for any score below 3, or for a 4 |
| Result | `PASS` if D5 is Pass and D1–D4 are each 3 or higher. Otherwise `FAIL`. |
| Review latency | From the agent finishing to the human review decision, in minutes |
| Cost | Cost in USD, plus input/output tokens if available. Write `n/a` if unknown. |
| Observations | What worked, what failed, and what changed since the previous run |

## Runs

| Run ID | Date | Agent/tool | Prompt or command | Cycle time (min) | D1 | D2 | D3 | D4 | D5 | Total /16 | Score notes | Result | Review latency (min) | Cost (USD, tokens in/out) | Observations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-01 | | | | | | | | | | | | | | | |
