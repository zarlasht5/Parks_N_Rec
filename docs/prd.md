# Product Requirements Document: Linter/Type-Checker Summary Task

## Workflow Description
A single agent run executes the project's linter and type checker, then reports a summary of results.

## Trigger
A human invokes the agent with the instruction: "Run the project's linter or type checker and summarize the results."

## Decision Events
- Does the agent have pre-approved permission to execute the required commands (`tsc`, `ng lint`, etc.)? If not, it must stop and report exactly what is blocked and why, rather than guessing at results.
- Does the type checker report any errors? If so, list them; if not, state that it passed cleanly.
- Does the linter report any errors or warnings? If so, categorize and summarize them by file and rule; if not, state that it passed cleanly.
- Did the agent need to modify any files to complete the task? It should not — this is a read/report-only task.

## Ordered Actions
1. Agent receives the task instruction.
2. Agent identifies the project's type-check command(s) (e.g., `tsc --noEmit` for relevant `tsconfig` files).
3. Agent runs the type-check command(s).
4. Agent identifies the project's lint command (e.g., `ng lint` / `tslint`).
5. Agent runs the lint command.
6. Agent summarizes results: pass/fail status for each check, and for any failures, a categorized list of errors by file and rule.
7. Agent reports the summary to the human without making any file changes.

## Falsifiable Acceptance Criteria
- Given pre-approved permissions for the required commands, the agent successfully executes both the type checker and the linter without requiring manual intervention.
- If either command is blocked due to missing permissions, the agent explicitly states which command was blocked and what permission would resolve it, rather than fabricating results or silently skipping the step.
- If the linter reports errors, the summary includes the specific file, rule name, and line number for each error (not just an aggregate count).
- The agent makes zero file modifications during this task.
- The reported pass/fail status for each check (type-check, lint) matches the actual exit code/output of the underlying command — verifiable by re-running the command manually and comparing results.
