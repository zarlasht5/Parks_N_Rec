# Parallel Agent Session Tasks

## Session A

Branch name: feature/agent-a
Worktree directory: repo-agent-a
Task: Run the project’s linter or test command, then create a short report summarizing the most important failures
Files or folders the agent may write to: e2e, app.component.spec.ts, googlemaps.service.spec.ts, test.ts
Files or folders the agent may read but not write to: node_modules, package.json, angular.json, tsconfig.json, tsconfig.spec.json, karma.conf.js
Commands the agent may run: npm test
Definition of done: Short report summarizing the most important failures is generated

## Session B

Branch name: feature/agent-b
Worktree directory: repo-agent-b
Task: Create a small developer note explaining how one part of the project works
Files or folders the agent may write to: googlemaps.service.ts
Files or folders the agent may read but not write to: googlemaps.service.spec.ts, app, assets
Commands the agent may run: npm run
Definition of done: Create a small developer note explaining how one part of the project works