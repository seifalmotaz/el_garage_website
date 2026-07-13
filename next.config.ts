import type { NextConfig } from "next";

/**
 * El Garage Next.js configuration.
 *
 * Environment-driven configuration (API base URL, future feature flags,
 * etc.) lives in `.env.local` at the project root. Copy
 * `.env.local.example` to `.env.local` and fill in real values — never
 * commit `.env.local` (it is gitignored).
 *
 * Anything that needs to be available to the browser must be prefixed
 * with `NEXT_PUBLIC_`. Server-only secrets MUST NOT use that prefix.
 */
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
