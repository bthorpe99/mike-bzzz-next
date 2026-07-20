import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const hasRealSentryReleaseConfig = (value: string | undefined) =>
  !!value && !/your_|placeholder|example/i.test(value);

const nextConfig: NextConfig = {
  /* config options here */
};

const sentryReleaseConfigured =
  hasRealSentryReleaseConfig(process.env.SENTRY_AUTH_TOKEN) &&
  hasRealSentryReleaseConfig(process.env.SENTRY_ORG) &&
  hasRealSentryReleaseConfig(process.env.SENTRY_PROJECT);

export default sentryReleaseConfigured ? withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: {
    disable: false,
  },
}) : nextConfig;
