/**
 * Progressive 360° frame engine — web port of the Flutter
 * `ElGarage360Viewer` loading strategy:
 *
 *   1. Fetch all **low** frames first (fast spin).
 *   2. Stream **high** frames in the background (quality upgrade).
 *   3. On 4K mode, buffer **original** frames around the current index.
 *
 * Display always picks the best available tier for the active frame,
 * falling back to the nearest loaded neighbour so the spin never blanks.
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  normalizeTier,
  type Car360Manifest,
  type Car360TierUrls,
} from "@/lib/api/car-360";

export type Car360EngineState = {
  totalFrames: number;
  currentFrame: number;
  is4KMode: boolean;
  /** 0–1 progress while the initial low-tier batch is loading. */
  loadProgress: number;
  /** True until the first usable frame is ready. */
  isBootstrapping: boolean;
  /** Best image URL currently available for `currentFrame`, or null. */
  displaySrc: string | null;
  /** True when showing a neighbour frame while the exact one loads. */
  isApproximate: boolean;
  setFrame: (index: number) => void;
  stepFrame: (delta: number) => void;
  toggle4K: () => void;
};

const FOUR_K_BUFFER = 3;

/** In-flight URL preloads — browser-cached after first success. */
const inflight = new Map<string, Promise<void>>();

function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

function emptyTiers(): Car360TierUrls {
  return { low: [], high: [], original: [] };
}

/** Resolve tier URLs, filling gaps so the engine always has something to spin. */
function resolveTiers(manifest: Car360Manifest | null): Car360TierUrls {
  if (!manifest) return emptyTiers();
  const tiers = normalizeTier(manifest);
  if (
    tiers.low.length === 0 &&
    tiers.high.length === 0 &&
    tiers.original.length > 0
  ) {
    return {
      low: tiers.original,
      high: tiers.original,
      original: tiers.original,
    };
  }
  if (tiers.low.length === 0 && tiers.high.length > 0) {
    return { ...tiers, low: tiers.high };
  }
  if (tiers.high.length === 0 && tiers.low.length > 0) {
    return { ...tiers, high: tiers.low };
  }
  return tiers;
}

function preload(url: string): Promise<void> {
  if (!url) return Promise.resolve();
  const existing = inflight.get(url);
  if (existing) return existing;
  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
  inflight.set(url, promise);
  return promise;
}

function pickBestSrc(
  idx: number,
  total: number,
  tiers: Car360TierUrls,
  loadedLow: ReadonlySet<number>,
  loadedHigh: ReadonlySet<number>,
  loadedOriginal: ReadonlySet<number>,
  is4K: boolean,
): { src: string; exact: boolean } | null {
  if (total <= 0) return null;

  if (is4K && loadedOriginal.has(idx) && tiers.original[idx]) {
    return { src: tiers.original[idx], exact: true };
  }
  if (loadedHigh.has(idx) && tiers.high[idx]) {
    return { src: tiers.high[idx], exact: true };
  }
  if (loadedLow.has(idx) && tiers.low[idx]) {
    return { src: tiers.low[idx], exact: true };
  }

  for (let r = 1; r < total; r++) {
    const forward = wrapIndex(idx + r, total);
    if (loadedHigh.has(forward) && tiers.high[forward]) {
      return { src: tiers.high[forward], exact: false };
    }
    if (loadedLow.has(forward) && tiers.low[forward]) {
      return { src: tiers.low[forward], exact: false };
    }
    const backward = wrapIndex(idx - r, total);
    if (loadedHigh.has(backward) && tiers.high[backward]) {
      return { src: tiers.high[backward], exact: false };
    }
    if (loadedLow.has(backward) && tiers.low[backward]) {
      return { src: tiers.low[backward], exact: false };
    }
  }
  return null;
}

function addToSet(prev: ReadonlySet<number>, index: number): ReadonlySet<number> {
  if (prev.has(index)) return prev;
  const next = new Set(prev);
  next.add(index);
  return next;
}

export function useCar360Engine(
  manifest: Car360Manifest | null,
): Car360EngineState {
  const tiers = useMemo(() => resolveTiers(manifest), [manifest]);
  const totalFrames = manifest?.totalFrames ?? 0;
  const carKey = manifest?.carId ?? "";

  const [currentFrame, setCurrentFrame] = useState(0);
  const [is4KMode, setIs4KMode] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedLow, setLoadedLow] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const [loadedHigh, setLoadedHigh] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const [loadedOriginal, setLoadedOriginal] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  // Progressive preload when a car manifest arrives.
  useEffect(() => {
    if (!carKey || totalFrames === 0) return;

    let cancelled = false;
    const lowUrls = tiers.low;
    const highUrls = tiers.high;
    const lowTotal = Math.max(lowUrls.length, 1);
    let lowDone = 0;

    // Session state starts clean on mount (Car360Stage remounts each open).
    // Async preload completions update state via the setters below.

    const run = async () => {
      const order = [
        0,
        ...Array.from({ length: totalFrames }, (_, i) => i).filter(
          (i) => i !== 0,
        ),
      ];

      await Promise.all(
        order.map(async (i) => {
          if (cancelled) return;
          await preload(lowUrls[i] ?? "");
          if (cancelled) return;
          setLoadedLow((prev) => addToSet(prev, i));
          lowDone += 1;
          setLoadProgress(Math.min(1, lowDone / lowTotal));
        }),
      );

      if (cancelled || highUrls.length === 0) return;

      for (let r = 0; r < totalFrames; r++) {
        if (cancelled) return;
        const targets =
          r === 0
            ? [0]
            : [r, totalFrames - r].filter(
                (idx, pos, arr) =>
                  idx > 0 && idx < totalFrames && arr.indexOf(idx) === pos,
              );
        await Promise.all(
          targets.map(async (i) => {
            if (cancelled || !highUrls[i]) return;
            await preload(highUrls[i]);
            if (cancelled) return;
            setLoadedHigh((prev) => addToSet(prev, i));
          }),
        );
        await new Promise((resolve) => setTimeout(resolve, 8));
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
    // tiers.low / tiers.high are derived from carKey; re-run on identity change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carKey, totalFrames]);

  // 4K buffer around the current frame while 4K mode is on.
  useEffect(() => {
    if (!is4KMode || totalFrames === 0) return;
    let cancelled = false;
    const urls = tiers.original;
    if (urls.length === 0) return;

    const loadBuffer = async () => {
      for (let r = -FOUR_K_BUFFER; r <= FOUR_K_BUFFER; r++) {
        const idx = currentFrame + r;
        if (idx < 0 || idx >= urls.length) continue;
        await preload(urls[idx]);
        if (cancelled) return;
        setLoadedOriginal((prev) => addToSet(prev, idx));
      }
    };
    void loadBuffer();
    return () => {
      cancelled = true;
    };
  }, [is4KMode, currentFrame, totalFrames, tiers.original]);

  const setFrame = useCallback(
    (index: number) => {
      if (totalFrames === 0) return;
      setCurrentFrame(wrapIndex(index, totalFrames));
    },
    [totalFrames],
  );

  const stepFrame = useCallback(
    (delta: number) => {
      if (totalFrames === 0) return;
      setCurrentFrame((prev) => wrapIndex(prev + delta, totalFrames));
    },
    [totalFrames],
  );

  const toggle4K = useCallback(() => {
    setIs4KMode((prev) => !prev);
  }, []);

  const best = pickBestSrc(
    currentFrame,
    totalFrames,
    tiers,
    loadedLow,
    loadedHigh,
    loadedOriginal,
    is4KMode,
  );

  const isBootstrapping = totalFrames > 0 && best === null && loadProgress < 1;

  return {
    totalFrames,
    currentFrame,
    is4KMode,
    loadProgress,
    isBootstrapping,
    displaySrc: best?.src ?? null,
    isApproximate: best ? !best.exact : false,
    setFrame,
    stepFrame,
    toggle4K,
  };
}
