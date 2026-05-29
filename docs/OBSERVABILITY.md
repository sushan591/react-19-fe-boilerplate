# Observability

Where errors, performance, and user behavior signal land — and what the team is expected to watch.

## Tooling map

| Concern                | System                                  | Code touchpoint                          |
| ---------------------- | --------------------------------------- | ---------------------------------------- |
| Exceptions             | Sentry                                  | `src/core/sentry/sentry.ts`              |
| Performance (Web Vitals) | Sentry tracing + breadcrumbs          | `src/core/perf/reportWebVitals.ts`       |
| Session replay         | Sentry Replay (prod only, 10% sample)   | `src/core/sentry/sentry.ts:88-94`        |
| App logging            | `logger` → console (dev) / Sentry breadcrumb (prod) | `src/core/log/logger.ts`     |
| Bundle size            | `npm run size:check` in `production-deploy.yml` | `scripts/check-bundle-size.mjs`  |
| Dependency CVEs        | Dependabot + `npm run audit:ci` in CI   | `.github/dependabot.yml`, `.github/workflows/security.yml` |

Errors and traces share the same Sentry project (one DSN, one inbox).

## Required Sentry configuration

The DSN comes from `VITE_SENTRY_DSN`. Configure the rest in the Sentry dashboard — these alerts/rules **are not in the repo** (Sentry stores them per project).

### Alert rules

| Rule                                            | Severity | Channel        | Notes                                                |
| ----------------------------------------------- | -------- | -------------- | ---------------------------------------------------- |
| New issue type seen in production               | High     | On-call paging | "Issue is created" trigger, environment = production |
| Error count > 50 in 5 minutes (production)      | High     | On-call paging | Use issue-frequency condition                        |
| Error spike: 5× baseline over 1 hour            | Medium   | Team channel   | Sentry's built-in "spike" alert                      |
| Sentry quota at 80%                             | Medium   | Team channel   | Spend control                                        |
| LCP regression (p75 > 4s for >10 min)           | Medium   | Team channel   | Web Vitals metric alert                              |
| INP regression (p75 > 500ms for >10 min)        | Medium   | Team channel   | Web Vitals metric alert                              |

If an alert here doesn't exist in Sentry, treat that as a P3 follow-up. The repo isn't the source of truth, but it documents what should exist.

### Environments

Create distinct Sentry environments: `development`, `staging`, `production`. `src/core/sentry/sentry.ts` already tags events with `import.meta.env.MODE`.

### Releases

Releases are tagged in Sentry by the `release` field in `Sentry.init()`. To get source-map symbolication, run the `@sentry/vite-plugin` (currently not wired — track as a future improvement when sourcemaps for prod are needed) or upload sourcemaps manually as part of `production-deploy.yml`.

## Dashboards

There is no separate metrics backend (no Grafana, no Datadog, no GA). All centralized reporting flows through Sentry:

- **Issues** — error inbox; assign + triage during weekly bug bash.
- **Performance** — `web-vitals` measurements arrive as transactions; view in Sentry Performance.
- **Releases** — Sentry release page shows regressions diffed against the previous release tag.
- **Replays** — production-only, 10% sample, 100% on errors. Use to reproduce hard-to-repro issues.

If/when the app outgrows Sentry-only reporting, add the new system here.

## Day-to-day expectations

- **PR author**: trigger a known error in your branch (e.g. via `src/examples/SentryTestComponent.tsx`) and confirm it lands in Sentry before merging anything that touches error paths.
- **On-call**: subscribe to the production Sentry alerts via Slack/PagerDuty. Acknowledge within SLA. Use `clearToken()` + `localStorage.clear()` in DevTools to mimic a logged-out replay locally.
- **Release captain**: after a tag is cut, watch Sentry for the first 30 minutes for new issues bearing the new release tag.

## When you change observability

Anything that adds, removes, or moves a signal type belongs here. Update this doc in the same PR as the code change. Don't rely on Sentry-side configuration as the only record — when a teammate joins, this is what they read.
