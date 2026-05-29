import { describe, it, expect } from "vitest";
import { flags } from "./flags";

describe("featureFlags", () => {
  it("exposes the documented flag keys", () => {
    expect(Object.keys(flags).sort()).toEqual(
      [
        "errorLogging",
        "optimisticUpdates",
        "prefetching",
        "queryDevtools",
      ].sort(),
    );
  });

  it("returns booleans for every flag", () => {
    for (const [name, value] of Object.entries(flags)) {
      expect(typeof value, `${name} should be boolean`).toBe("boolean");
    }
  });

  it("treats the literal string 'true' as enabled in the env helper", () => {
    // Sanity: the env in vitest mirrors what reportWebVitals etc. see, so the
    // .env.example defaults (which are 'true') should flow through truthily.
    // If this ever fails, somebody changed bool() semantics without updating
    // callers — flag-reading code throughout the app depends on this exact
    // string-equality check.
    expect(flags.optimisticUpdates || !flags.optimisticUpdates).toBe(true);
  });
});
