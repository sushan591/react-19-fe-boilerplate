/**
 * Build-time feature flags driven by VITE_ENABLE_* env vars.
 *
 * We use build-time env-var flags (not a runtime service like LaunchDarkly /
 * GrowthBook) because: (a) this is a single-tenant frontend with no per-user
 * targeting needs yet, (b) flag flips are batched with releases, not hot, and
 * (c) avoiding a runtime SDK keeps the bundle small and removes a network
 * dependency on first paint.
 *
 * To add a flag:
 *   1. Add `VITE_ENABLE_FOO=true` to `.env.example` with a short comment.
 *   2. Add `readonly VITE_ENABLE_FOO: string` to `src/vite-env.d.ts`.
 *   3. Add a key here, return a `bool(env.VITE_ENABLE_FOO)` accessor.
 *   4. Read it from app code as `flags.foo`.
 *
 * If we ever outgrow this, swap the bodies of these accessors with calls into
 * a real flag SDK — callers don't need to change.
 */

const env = import.meta.env;

const bool = (value: string | undefined): boolean => value === "true";

export const flags = {
  optimisticUpdates: bool(env.VITE_ENABLE_OPTIMISTIC_UPDATES),
  prefetching: bool(env.VITE_ENABLE_PREFETCHING),
  queryDevtools: bool(env.VITE_ENABLE_QUERY_DEVTOOLS),
  errorLogging: bool(env.VITE_ENABLE_ERROR_LOGGING),
} as const;

export type FeatureFlag = keyof typeof flags;
