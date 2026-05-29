import type { Metric } from "web-vitals";
import { addBreadcrumb } from "@/core/sentry/sentry";

const isDev = import.meta.env.MODE === "development";

const handleMetric = (metric: Metric) => {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.info(
      `[web-vitals] ${metric.name}=${metric.value.toFixed(2)} (${metric.rating})`,
    );
  }

  addBreadcrumb(
    `${metric.name}=${metric.value.toFixed(2)} (${metric.rating})`,
    "web-vitals",
    metric.rating === "poor" ? "warning" : "info",
  );
};

export const reportWebVitals = async () => {
  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import("web-vitals");
  onCLS(handleMetric);
  onINP(handleMetric);
  onLCP(handleMetric);
  onFCP(handleMetric);
  onTTFB(handleMetric);
};
