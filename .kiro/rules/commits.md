---
description: Conventional commit message format for this repository
alwaysApply: true
---

# Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <short description>
```

## Types

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `chore` — maintenance, tooling, deps (no production code change)
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or updating tests
- `ci` — CI/CD changes
- `build` — build system or external dependencies
- `perf` — performance improvement

## Rules

- Lowercase type, colon, space, then description
- Imperative mood: "add feature" not "added feature"
- No trailing period on the subject line
- Keep subject under ~72 characters; **no commit body** unless the user explicitly asks for one
- No Co-Authored-By trailers; author commits as the user only
- After committing, run `git log -1 --format=full` to verify no extra trailers slipped in
- `.githooks/commit-msg` strips co-author lines; enable via `npm run setup` or `git config core.hooksPath .githooks`
- **Do NOT commit unless the user explicitly asks to commit**

## Examples

```
feat: add Clerk profile sync endpoint
fix: wait for token bridge before auth sync
chore: ignore local caveman skill files
docs: document Railway deploy steps
```
