# Contributing

How we branch, name, commit, and merge in this repository. Read this once before your first PR.

## Branching strategy

We follow a **GitHub Flow with environment branches** model:

| Branch       | Role                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `main`       | Default integration branch. Always green (CI passes, builds, tests). |
| `staging`    | Staging deploy target. Push (or fast-forward merge from `main`) triggers `.github/workflows/staging-deploy.yml`. |
| `production` | Production deploy target (reserved — workflow not yet wired).        |

Rules:

- All work starts from `main` and is merged back into `main` via a Pull Request.
- `staging` and `production` only ever receive code that has already landed on `main`. Never commit directly.
- Long-lived `develop`/`release-*` branches are not used. Keep feature branches short — split work into multiple PRs if a branch lives more than ~3 days.
- Hotfixes still go through `main` → `staging` → `production`. Don't patch deploy branches directly.

## Branch naming

Use the pattern `<type>/<short-kebab-description>`, optionally prefixed with an issue ID:

```
feat/add-product-filtering
fix/auth-token-refresh-race
chore/bump-sentry-to-10
docs/contributing-guide
refactor/extract-auth-hooks
test/cover-error-boundary
perf/lazy-load-sentry
ci/add-security-workflow
feat/PROJ-431-bulk-import
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`.

Keep the description under ~50 characters. No spaces, no uppercase — kebab-case only.

## Commit messages

Conventional Commits, enforced at commit time by `commitlint` via `.husky/commit-msg` (see `commitlint.config.js` for the exact `type-enum` we allow):

```
<type>(<optional scope>): <imperative summary>

<optional body — what changed and why, hard-wrap at ~72 cols>

<optional footer — BREAKING CHANGE, Refs PROJ-431, etc.>
```

Examples:

- `feat(auth): persist refresh token across reloads`
- `fix(api): retry 429s with exponential backoff`
- `chore(deps): bump vitest to 4.1.7`

Bad examples (avoid):

- `Update stuff` — meaningless
- `WIP` — fine on a feature branch, never on `main`
- `Fixes #123` as the whole message — no.

## Daily workflow (WIP commits welcome)

While developing on your feature branch:

- **Commit often.** WIP commits are fine — they're cheap and let you bisect later. End-of-day, push your branch even if the work is half-done. A pushed branch is a backed-up branch.
- **Pull `main` daily.** `git fetch origin && git rebase origin/main` to keep your branch current. Merges in feature branches make the eventual squash messier.
- **Tidy up before review.** Once the PR is ready for review, rebase interactively (`git rebase -i origin/main`) to collapse WIP/`fixup!` commits into a meaningful history. Force-push to your branch (`git push --force-with-lease`).
- **Never rewrite history on `main`, `staging`, or `production`.**

## Pull request flow

1. Open a PR from `your-branch` → `main`.
2. CI must be green (lint, tests, build, security workflow).
3. Get at least one approving review.
4. **Merge with "Squash and merge"** — keeps `main` history one-commit-per-PR. The squash commit message should follow Conventional Commits and reference the PR.
5. Delete the source branch after merge (GitHub setting recommended).

Exceptions:

- **Rebase and merge** is allowed when the branch already has a clean, conventional commit history that's worth preserving (e.g., a multi-commit refactor where each step is independently reviewable).
- **Merge commits** are not used here.

## Deployments

- `staging`: fast-forward `main` into `staging` and push. The `staging-deploy` workflow takes it from there.
- `production`: TBD (workflow pending).

Never push a feature branch directly to `staging` or `production`.

## Releases

We follow [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/).

To cut a release:

1. **Update `CHANGELOG.md`** — move the entries you're shipping from `## [Unreleased]` into a new dated `## [x.y.z] - YYYY-MM-DD` section. Add the matching link reference at the bottom.
2. **Commit** that change on `main` with a `docs(changelog): prep vX.Y.Z` message.
3. **Bump + tag**:
   - `npm run release:patch` — bug fixes only (0.1.0 → 0.1.1)
   - `npm run release:minor` — new features, backwards-compatible (0.1.0 → 0.2.0)
   - `npm run release:major` — breaking changes (0.1.0 → 1.0.0)

   Each `release:*` script runs `preversion` (lint + tests + build) first; if any step fails, no tag is created. On success it pushes the commit and tag together.
4. **Release workflow takes over.** `.github/workflows/release.yml` triggers on the `v*.*.*` tag: it builds, packages `dist/` as `bentigration-frontend-vX.Y.Z.tar.gz`, and creates a GitHub Release using the matching CHANGELOG section.

What the version means:

- **MAJOR** (`x`): breaking changes — bumped public API, removed env vars, persisted-state shape changes that need migration.
- **MINOR** (`y`): new features, additive changes only.
- **PATCH** (`z`): bug fixes, security patches, dependency bumps that don't change behavior.

Hotfixes follow the same flow but go straight from `main` once landed. Don't tag from a feature branch.

## Issues and reviews

- Link your PR to the relevant issue with `Closes #N` in the description.
- Reviewers: focus on correctness, security, and clarity — style is auto-handled by ESLint + Prettier on commit.
- Authors: respond to review comments inline (resolve when addressed); avoid force-pushing during review unless you also leave a note explaining the rebase.
