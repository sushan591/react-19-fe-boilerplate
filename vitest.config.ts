import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/tests/setup.ts",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/main.tsx",
        "src/init.ts",
        "src/tests/**",
        "src/examples/**",
        "src/types/**",
        "src/router/**",
      ],
      // Thresholds apply to files that ARE imported by a test (the default
      // istanbul mode — uncovered files don't pull the average down). The
      // intent: catch regressions on code that already has tests, not gate on
      // overall codebase coverage. As test surface grows, ratchet these up
      // and consider adding `all: true` to enforce broader floors.
      thresholds: {
        autoUpdate: false,
        lines: 80,
        functions: 60,
        branches: 50,
        statements: 80,
      },
    },
  },
});
