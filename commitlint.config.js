/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Keep aligned with the type list in CONTRIBUTING.md "Branch naming".
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "refactor",
        "test",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
    // Header length cap matches our 72-col body guidance.
    "header-max-length": [2, "always", 100],
  },
};
