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

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
};

/**
 * Hosts allowed for `next/image` remote car/article media.
 * Always include production + local backend defaults; also parse
 * `NEXT_PUBLIC_API_URL` when set so staging works without code edits.
 */
function buildRemotePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [
    {
      protocol: "https",
      hostname: "elgarage-back.seifalmotaz.com",
      pathname: "/**",
    },
    // Seed / demo car images (backend test-seed uses picsum)
    {
      protocol: "https",
      hostname: "picsum.photos",
      pathname: "/**",
    },
    // Cloudflare R2 public buckets (production car images / media)
    // e.g. https://pub-….r2.dev/car-images/...
    {
      protocol: "https",
      hostname: "**.r2.dev",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "pub-3b2d0446a25e442d92532f7bd1a6be78.r2.dev",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "3000",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "4236",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "3000",
      pathname: "/**",
    },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      const protocol =
        parsed.protocol === "http:" || parsed.protocol === "https:"
          ? (parsed.protocol.replace(":", "") as "http" | "https")
          : null;
      if (protocol && parsed.hostname) {
        const entry: RemotePattern = {
          protocol,
          hostname: parsed.hostname,
          pathname: "/**",
        };
        if (parsed.port) entry.port = parsed.port;
        const exists = patterns.some(
          (p) =>
            p.hostname === entry.hostname &&
            p.protocol === entry.protocol &&
            (p.port ?? "") === (entry.port ?? ""),
        );
        if (!exists) patterns.push(entry);
      }
    } catch {
      // Ignore malformed NEXT_PUBLIC_API_URL at build time.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: buildRemotePatterns(),
  },
};

export default nextConfig;
