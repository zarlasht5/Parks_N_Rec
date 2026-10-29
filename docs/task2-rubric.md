# Rubric: Build Command Success Check

Each run is scored against the dimensions below, derived from `docs/prd.md`'s acceptance criteria.

## D1: Execution Completeness

**Definition:** The agent successfully executes `npm run build` to completion, given pre-approved permissions, without requiring manual intervention.

| Level | Description | Example |
|---|---|---|
| 1 | Does not meet | Build command never runs; agent stalls, errors out, or fabricates a result. |
| 2 | Partially meets | Build command starts but the agent gives up partway or returns an ambiguous result. |
| 3 | Meets | Build command runs to completion and a clear success/failure status is determined. |
| 4 | Exceeds | Build runs to completion, and the agent notes something additionally useful (e.g., build duration, output bundle size) without being asked. |

## D2: Permission/Blocker Transparency

**Definition:** If the build command is blocked, the agent explicitly states this and what would resolve it, rather than fabricating a result or silently omitting the step.

| Level | Description | Example |
|---|---|---|
| 1 | Does not meet | Agent silently reports a result without ever running the command, or invents a plausible-sounding outcome. |
| 2 | Partially meets | Agent mentions something was blocked but doesn't specify what or how to fix it. |
| 3 | Meets | Agent clearly states the build was blocked and what permission or action would resolve it. |
| 4 | Exceeds | Agent does the above and offers to configure the fix itself if given approval. |

## D3: Error Reporting Granularity

**Definition:** If the build fails, the summary includes the specific error message(s) that caused the failure, not just a generic pass/fail statement.

| Level | Description | Example |
|---|---|---|
| 1 | Does not meet | Agent reports only "build failed" with no further detail. |
| 2 | Partially meets | Agent reports a vague cause (e.g., "a compile error") without the actual error text. |
| 3 | Meets | Agent includes the specific error message(s) and the file/location where the failure occurred. |
| 4 | Exceeds | Agent does the above and also explains the likely root cause in plain terms. |

## D4: Scope Discipline (No Unintended Changes)

**Definition:** The agent modifies only `docs/build-report.md` and no other file.

| Level (binary) | Description | Example |
|---|---|---|
| Fail | Does not meet | Agent modifies, creates, or deletes any file other than `docs/build-report.md`. |
| Pass | Meets | Only `docs/build-report.md` is created or modified. |

## D5: Result Accuracy

**Definition:** The reported success/failure status matches the actual exit code of `npm run build`, verifiable by independently re-running the command.

| Level (binary) | Description | Example |
|---|---|---|
| Fail | Does not meet | The agent reports success for a build that actually failed when re-run manually, or vice versa. |
| Pass | Meets | Manually re-running `npm run build` produces a result consistent with what the agent reported. |

## Scoring and Pass Threshold

- **D1–D3** are scored 1–4 each, summed for a **Total out of 12**.
- **D4 and D5** are binary gates (Pass/Fail), not included in the numeric total.
- **A run is a PASS** if D4 and D5 are both Pass, and D1–D3 are each scored 3 or higher (Total ≥ 9/12). Otherwise, the run is a **FAIL**.
