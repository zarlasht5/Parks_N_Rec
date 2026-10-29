# Product Requirements Document: Build Command Success Check

## Task Description
A single agent run executes the project's documented build command (`npm run build`) and reports whether it succeeds or fails, saving the summary to a report file.

## Prompt
> Run `npm run build` and report whether it succeeds or fails. If it fails, summarize the specific error message(s) that caused the failure. Save the summary to `docs/build-report.md`. Do not attempt to fix any build errors. Do not modify any source files.

## Trigger
A human invokes the agent with the prompt above.

## Decision Events
- Does the agent have pre-approved permission to execute `npm run build`? If not, it must stop and report exactly what is blocked and why.
- Does the build command complete successfully (exit code 0)? If not, the agent must report the specific error(s) causing failure, not just "it failed."
- Did the agent save its summary to the correct location (`docs/build-report.md`)?
- Did the agent modify any file other than `docs/build-report.md`? It should not.

## Ordered Actions
1. Agent receives the task instruction.
2. Agent runs `npm run build`.
3. Agent determines success or failure from the command's actual exit code/output.
4. If failed, agent extracts and summarizes the specific error message(s).
5. Agent writes the summary to `docs/build-report.md`.
6. Agent reports completion to the human without modifying any other file.

## Falsifiable Acceptance Criteria
- Given pre-approved permission, the agent successfully executes `npm run build` without requiring manual intervention.
- The agent's reported success/failure status matches the actual exit code of the build command, verifiable by re-running it manually.
- If the build fails, `docs/build-report.md` contains the specific error message(s), not just a generic "build failed" statement.
- `docs/build-report.md` is created or updated; no other file is modified.
