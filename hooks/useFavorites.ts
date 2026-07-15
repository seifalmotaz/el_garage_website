/**
 * Hook for client-side favorites backed by `localStorage`.
 *
 * Mirrors the mobile contract in
 * `app/lib/core/storage/favorites_storage.dart` — a plain list of car
 * UUIDs persisted as a JSON-encoded string under the key
 * `elgarage_favorites`. There is no backend sync; favorites live
 * entirely in the browser.
 *
 * The hook:
 *   - lazily reads the stored list on mount (SSR-safe via the
 *     `typeof window === "undefined"` guard),
 *   - exposes `favorites`, `isFavorite(id)`, `toggle(id)`,
 *     `add(id)`, `remove(id)`, and `clear()`,
 *   - subscribes to the `storage` event so a change from another tab
 *     (or another component using the same key) is reflected without
 *     a manual refetch.
 *
 * The hook is intentionally NOT built on SWR — localStorage reads are
 * synchronous and would just add a layer of indirection. Callers that
 * want to invalidate a related SWR key after a toggle should do so
 * explicitly (e.g. by importing SWR's global `mutate`).
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/** localStorage key under which favorites are persisted. */
export const FAVORITES_STORAGE_KEY = "elgarage_favorites";

/**
 * Read the stored favorites list from `localStorage`. Returns `[]` when
 * the key is missing, malformed, or running in a non-browser context
 * (e.g. SSR) where `localStorage` is undefined.
 */
function readStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

/**
 * Persist the favorites list to `localStorage`. No-op outside the
 * browser. Errors are swallowed so callers don't need to wrap reads in
 * a try/catch — storage may be unavailable (private mode, quota, etc.)
 * and the in-memory state still works for the session.
 */
function writeStoredFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage may be unavailable — fail silently and keep the in-memory state.
  }
}

export type UseFavoritesResult = {
  /** The current list of favorited car ids, deduplicated and ordered. */
  favorites: string[];
  /**
   * `true` until the initial `localStorage` read has completed. SSR
   * always starts as `true` and flips to `false` after the first
   * client-side effect; this avoids hydration mismatches between the
   * server render and the first client render.
   */
  isLoading: boolean;
  /** Test whether a car id is in the favorites list. */
  isFavorite: (carId: string) => boolean;
  /** Add a car id to the favorites list (no-op if already present). */
  add: (carId: string) => void;
  /** Remove a car id from the favorites list (no-op if not present). */
  remove: (carId: string) => void;
  /**
   * Toggle a car id's membership in the favorites list. Returns the
   * resulting `isFavorite` value so callers can wire the toggle into
   * UI affordances without re-reading state.
   */
  toggle: (carId: string) => boolean;
  /** Remove every car id from the favorites list. */
  clear: () => void;
};

/**
 * Use the local `localStorage`-backed favorites list.
 *
 * The hook reads on mount, exposes mutation helpers, and re-syncs
 * whenever a `storage` event fires (which happens across browser
 * tabs and any other writer using the same key).
 */
export function useFavorites(): UseFavoritesResult {
  // We start with an empty list and flip `isLoading` to `false` once
  // the client-side effect runs the first read. This avoids hydration
  // mismatches — the server never sees the stored list.
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial read — runs once on the client.
  useEffect(() => {
    setFavorites(readStoredFavorites());
    setIsLoading(false);
  }, []);

  // Cross-tab / cross-component sync via the `storage` event. The event
  // only fires in OTHER tabs/windows, so we don't double-handle our
  // own writes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== FAVORITES_STORAGE_KEY) return;
      setFavorites(readStoredFavorites());
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const add = useCallback((carId: string): void => {
    setFavorites((prev) => {
      if (prev.includes(carId)) return prev;
      const next = [...prev, carId];
      writeStoredFavorites(next);
      return next;
    });
  }, []);

  const remove = useCallback((carId: string): void => {
    setFavorites((prev) => {
      if (!prev.includes(carId)) return prev;
      const next = prev.filter((id) => id !== carId);
      writeStoredFavorites(next);
      return next;
    });
  }, []);

  const toggle = useCallback((carId: string): boolean => {
    // We don't read `prev` from the closure — the functional updater
    // is the source of truth, and computing the return value from it
    // ensures we report the post-toggle state.
    let nextIsFavorite = false;
    setFavorites((prev) => {
      const has = prev.includes(carId);
      nextIsFavorite = !has;
      const next = has
        ? prev.filter((id) => id !== carId)
        : [...prev, carId];
      writeStoredFavorites(next);
      return next;
    });
    return nextIsFavorite;
  }, []);

  const clear = useCallback((): void => {
    setFavorites(() => {
      writeStoredFavorites([]);
      return [];
    });
  }, []);

  const isFavorite = useCallback(
    (carId: string): boolean => favorites.includes(carId),
    [favorites],
  );

  // Stable reference for the favorites array — mirrors the `data ?? []`
  // pattern in the SWR-backed hooks so downstream `useEffect`s don't
  // fire on every render while the initial `localStorage` read is in
  // flight.
  const stableFavorites = useMemo<string[]>(
    () => favorites,
    [favorites],
  );

  return {
    favorites: stableFavorites,
    isLoading,
    isFavorite,
    add,
    remove,
    toggle,
    clear,
  };
}
