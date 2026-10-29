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
