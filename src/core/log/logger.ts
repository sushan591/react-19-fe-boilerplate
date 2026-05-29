/* eslint-disable no-console */
import { addBreadcrumb, captureException } from "@/core/sentry/sentry";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const mode = import.meta.env.MODE;
const isDev = mode === "development";
const isTest = mode === "test";

// Dev sees everything; prod swallows debug noise.
const minLevel: LogLevel = isDev || isTest ? "debug" : "info";

const shouldLog = (level: LogLevel) =>
  LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];

const emit = (
  level: LogLevel,
  message: string,
  data?: Record<string, unknown>,
) => {
  if (!shouldLog(level)) return;

  if (isDev || isTest) {
    const fn = console[level] ?? console.log;
    if (data) {
      fn(`[${level}]`, message, data);
    } else {
      fn(`[${level}]`, message);
    }
    return;
  }

  // Production: route through Sentry breadcrumbs. Errors also get captured.
  const breadcrumbLevel: "info" | "warning" | "error" =
    level === "error" ? "error" : level === "warn" ? "warning" : "info";
  addBreadcrumb(
    data ? `${message} ${JSON.stringify(data)}` : message,
    "log",
    breadcrumbLevel,
  );
};

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) =>
    emit("debug", message, data),
  info: (message: string, data?: Record<string, unknown>) =>
    emit("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) =>
    emit("warn", message, data),
  error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
    emit("error", message, data);
    if (error instanceof Error) {
      captureException(
        error,
        data as Record<string, string | number | boolean | null> | undefined,
      );
    }
  },
};
