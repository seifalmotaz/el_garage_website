"use client";

/**
 * Root client-side providers for the El Garage web app.
 *
 * Wraps every page (and the Header / Footer in `app/layout.tsx`) with:
 *   - `SWRConfig` — exposes our typed `fetcher` as the default so feature
 *     pages can call `useSWR('/cars')` without re-supplying one.
 *   - `AuthProvider` — supplies `useAuth()` and bootstraps the session
 *     from localStorage on mount.
 *
 * Keep this component minimal. Any new global provider (theme, query
 * client, etc.) should be nested here.
 */
import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { AuthProvider } from "@/contexts/AuthContext";
import { fetcher } from "@/lib/api/client";

/**
 * SWR default fetcher. Accepts the two key shapes used in this codebase:
 *   - a bare string URL (e.g. `useSWR('/cars')`)
 *   - a tuple whose first element is the URL (e.g.
 *     `useSWR(['/cars', filters])` — used by Phase 4 car listing)
 * Other key shapes are rejected so we fail loudly during development
 * instead of silently fetching a garbage URL.
 */
function swrFetcher(key: unknown): Promise<unknown> {
  if (typeof key === "string") {
    return fetcher(key);
  }
  if (Array.isArray(key) && typeof key[0] === "string") {
    return fetcher(key[0]);
  }
  throw new Error(
    "Invalid SWR key: expected a string or a tuple starting with a URL string.",
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: true,
        dedupingInterval: 30_000,
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </SWRConfig>
  );
}