/**
 * Fullscreen 360° experience — web equivalent of `Car360ViewScreen`.
 *
 * UX (aligned with the mobile app + web affordances):
 *  - Progressive tier loading (low → high → optional 4K originals)
 *  - Drag / swipe to spin, wheel + pinch to zoom, double-tap to reset
 *  - Auto-play, frame scrubber, glass controls that auto-hide
 *  - Keyboard: ←/→ spin, Space play, +/- zoom, 0 reset, F 4K, Esc close
 *  - Body scroll lock + focus management while open
 *  - Arabic copy for the RTL site; gestures stay natural LTR deltas
 */
"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCar360 } from "@/hooks/useCar360";
import { useCar360Engine } from "@/components/car-360/useCar360Engine";
import Car360Viewer, {
  type Car360ViewerHandle,
} from "@/components/car-360/Car360Viewer";
import { cn } from "@/lib/utils";

export type Car360ModalProps = {
  carId: string;
  /** Optional label shown in the chrome (e.g. "تويوتا كورولا"). */
  title?: string;
  open: boolean;
  onClose: () => void;
};

function GlassButton({
  children,
  onClick,
  active = false,
  label,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "size-10 rounded-full flex items-center justify-center",
        "border border-white/20 text-white backdrop-blur-md",
        "transition-colors cursor-pointer",
        active
          ? "bg-white/35 hover:bg-white/45"
          : "bg-white/10 hover:bg-white/20",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** SSR-safe "are we in the browser?" without setState-in-effect. */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Inner stage only mounts while `open` is true so chrome/play state resets
 * cleanly on each open without setState-in-effect.
 */
function Car360Stage({
  carId,
  title,
  onClose,
}: {
  carId: string;
  title?: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Car360ViewerHandle>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [showControls, setShowControls] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  const { manifest, isLoading, error, mutate } = useCar360(carId, true);
  const engine = useCar360Engine(manifest);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus dialog once mounted
  useEffect(() => {
    const id = requestAnimationFrame(() => dialogRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  const armHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  }, []);

  const handleInteract = useCallback(() => {
    setShowHint(false);
    setShowControls(true);
    armHideTimer();
  }, [armHideTimer]);

  useEffect(() => {
    armHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [armHideTimer]);

  // Auto-play ~20 fps
  useEffect(() => {
    if (!isPlaying || engine.totalFrames === 0) return;
    const id = setInterval(() => {
      engine.stepFrame(1);
    }, 50);
    playTimer.current = id;
    return () => {
      clearInterval(id);
      playTimer.current = null;
    };
    // stepFrame is stable for a given totalFrames; intentionally omit `engine`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, engine.totalFrames, engine.stepFrame]);

  // Browser fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleBrowserFullscreen = async () => {
    handleInteract();
    const el = dialogRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by the browser — ignore.
    }
  };

  const togglePlay = () => {
    handleInteract();
    setIsPlaying((p) => !p);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (document.fullscreenElement) {
        void document.exitFullscreen();
        return;
      }
      onClose();
      return;
    }
    if (engine.totalFrames === 0) return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        handleInteract();
        engine.stepFrame(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        handleInteract();
        engine.stepFrame(1);
        break;
      case " ":
        e.preventDefault();
        togglePlay();
        break;
      case "+":
      case "=":
        e.preventDefault();
        handleInteract();
        viewerRef.current?.zoomIn();
        break;
      case "-":
      case "_":
        e.preventDefault();
        handleInteract();
        viewerRef.current?.zoomOut();
        break;
      case "0":
        e.preventDefault();
        handleInteract();
        viewerRef.current?.resetView();
        engine.setFrame(0);
        break;
      case "f":
      case "F":
        e.preventDefault();
        handleInteract();
        engine.toggle4K();
        break;
      default:
        break;
    }
  };

  // 4K only when a distinct `original` tier exists alongside low/high.
  const show4KToggle = (() => {
    if (!manifest) return false;
    const urls = manifest.frameUrls as Record<string, string[]>;
    const hasLowOrHigh =
      (urls.low?.length ?? 0) > 0 || (urls.high?.length ?? 0) > 0;
    const hasOriginal = (urls.original?.length ?? 0) > 0;
    return hasLowOrHigh && hasOriginal;
  })();

  return (
    <>
      {/* Backdrop layer — only visible at sm+ where the modal isn't fullscreen. */}
      <div
        aria-hidden="true"
        className="hidden sm:block fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        dir="rtl"
        className={cn(
          "fixed z-[100] flex flex-col bg-[#06142d] outline-none",
          // Mobile: fullscreen experience (unchanged).
          "inset-0",
          // Desktop / tablet: centered modal, constrained to a comfortable
          // portion of the viewport with rounded corners and a backdrop. Keeps
          // the modal a distinct surface instead of swallowing the whole page.
          "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:h-[min(820px,calc(100vh-3rem))] sm:max-h-[calc(100vh-3rem)]",
          "sm:w-[min(1200px,calc(100vw-3rem))] sm:max-w-[calc(100vw-3rem)]",
          "sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl",
        )}
        onKeyDown={onKeyDown}
        onPointerDown={handleInteract}
      >
      <div className="absolute inset-0">
        {isLoading || engine.isBootstrapping ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 bg-[#06142d]">
            <div className="size-12 rounded-full border-3 border-white/10 border-t-primary-500 animate-spin" />
            <p className="text-white/60 text-sm">
              جاري التحميل…
              {engine.loadProgress > 0
                ? ` ${Math.round(engine.loadProgress * 100)}%`
                : ""}
            </p>
            <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-[width] duration-150"
                style={{ width: `${Math.round(engine.loadProgress * 100)}%` }}
              />
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 px-6 text-center">
            <p className="text-white text-lg font-medium">
              فشل تحميل عرض 360
            </p>
            <p className="text-white/60 text-sm max-w-md">{error.message}</p>
            <button
              type="button"
              onClick={() => mutate()}
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : null}

        {!isLoading && !error && manifest && engine.totalFrames === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
            <p className="text-white/70 text-base">
              لا يوجد عرض 360 لهذه السيارة
            </p>
          </div>
        ) : null}

        {!error && engine.totalFrames > 0 ? (
          <Car360Viewer
            ref={viewerRef}
            src={engine.displaySrc}
            isApproximate={engine.isApproximate}
            onDragFrames={(delta) => {
              if (isPlaying) setIsPlaying(false);
              engine.stepFrame(delta);
            }}
            onInteract={handleInteract}
            disabled={engine.isBootstrapping}
          />
        ) : null}
      </div>

      {/* Hint */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-30",
          "transition-opacity duration-500",
          showHint && !engine.isBootstrapping && !error
            ? "opacity-100"
            : "opacity-0",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-white text-sm font-medium">
          <span className="text-lg" aria-hidden>
            ⟷
          </span>
          <span>اسحب للاستكشاف</span>
        </div>
      </div>

      {/* Top chrome — always visible (navigation controls persist regardless of scroll/auto-hide). */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-3",
          "px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3",
          // Strong gradient so the close/title controls read against any frame.
          "bg-gradient-to-b from-black/70 via-black/30 to-transparent",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <GlassButton label="إغلاق" onClick={onClose}>
            <X className="size-5" />
          </GlassButton>
          <div className="min-w-0 hidden sm:block">
            <p
              id={titleId}
              className="text-white text-sm font-semibold truncate max-w-[40vw]"
            >
              {title ? `عرض 360° — ${title}` : "عرض 360°"}
            </p>
            {engine.totalFrames > 0 ? (
              <p className="text-white/50 text-xs">
                إطار {engine.currentFrame + 1} / {engine.totalFrames}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            label={isPlaying ? "إيقاف" : "تشغيل تلقائي"}
            onClick={togglePlay}
            active={isPlaying}
          >
            {isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </GlassButton>

          {show4KToggle ? (
            <GlassButton
              label="جودة 4K"
              onClick={() => {
                handleInteract();
                engine.toggle4K();
              }}
              active={engine.is4KMode}
              className="text-xs font-bold tracking-wide"
            >
              4K
            </GlassButton>
          ) : null}

          <GlassButton
            label="تكبير"
            onClick={() => {
              handleInteract();
              viewerRef.current?.zoomIn();
            }}
          >
            <ZoomIn className="size-5" />
          </GlassButton>
          <GlassButton
            label="تصغير"
            onClick={() => {
              handleInteract();
              viewerRef.current?.zoomOut();
            }}
          >
            <ZoomOut className="size-5" />
          </GlassButton>
          <GlassButton
            label="إعادة ضبط"
            onClick={() => {
              handleInteract();
              viewerRef.current?.resetView();
              engine.setFrame(0);
            }}
          >
            <RotateCcw className="size-4.5" />
          </GlassButton>
          <GlassButton
            label={isBrowserFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            onClick={() => {
              void toggleBrowserFullscreen();
            }}
            active={isBrowserFullscreen}
            className="hidden sm:flex"
          >
            {isBrowserFullscreen ? (
              <Minimize2 className="size-4.5" />
            ) : (
              <Maximize2 className="size-4.5" />
            )}
          </GlassButton>
        </div>
      </div>

      {/* Bottom scrubber */}
      {engine.totalFrames > 1 ? (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-40 px-8 sm:px-16 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
            "transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="mx-auto max-w-xl rounded-full bg-white/10 border border-white/10 backdrop-blur-md px-4 py-2">
            <label className="sr-only" htmlFor="car-360-scrubber">
              تدوير السيارة
            </label>
            <input
              id="car-360-scrubber"
              type="range"
              min={0}
              max={engine.totalFrames - 1}
              value={engine.currentFrame}
              onChange={(e) => {
                handleInteract();
                if (isPlaying) setIsPlaying(false);
                engine.setFrame(Number(e.target.value));
              }}
              className="w-full h-1.5 accent-white cursor-pointer"
              dir="ltr"
            />
          </div>
          <p className="text-center text-white/40 text-[11px] mt-2 hidden sm:block">
            ← → للتدوير · مسافة للتشغيل · Esc للإغلاق
          </p>
        </div>
      ) : null}
      </div>
    </>
  );
}

export default function Car360Modal({
  carId,
  title,
  open,
  onClose,
}: Car360ModalProps) {
  const isClient = useIsClient();

  if (!isClient || !open) return null;

  return createPortal(
    <Car360Stage carId={carId} title={title} onClose={onClose} />,
    document.body,
  );
}
