/**
 * Interactive 360° spin surface.
 *
 * Handles pointer drag (mouse + touch), wheel zoom, pinch zoom, and
 * double-tap reset. Frame advances are delegated to the engine via
 * `onDragFrames` so the parent owns load strategy and state.
 */
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { cn } from "@/lib/utils";

export type Car360ViewerHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
};

export type Car360ViewerProps = {
  /** Best-available frame image URL for the current index. */
  src: string | null;
  /** True while the exact frame is still loading (show neighbour). */
  isApproximate?: boolean;
  /** Pixels of horizontal drag per frame step (matches Flutter default 5). */
  sensitivity?: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  /** Called with signed frame deltas as the user drags. */
  onDragFrames: (delta: number) => void;
  /** Fired on first meaningful interaction (hide hint, show controls). */
  onInteract?: () => void;
  /** When true, pointer events are disabled (e.g. still bootstrapping). */
  disabled?: boolean;
};

const DRAG_THRESHOLD = 8;
const ZOOM_STEP = 0.15;

const Car360Viewer = forwardRef<Car360ViewerHandle, Car360ViewerProps>(
  function Car360Viewer(
    {
      src,
      isApproximate = false,
      sensitivity = 5,
      minZoom = 1,
      maxZoom = 4,
      className,
      onDragFrames,
      onInteract,
      disabled = false,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const dragRef = useRef({
      active: false,
      spinStarted: false,
      startX: 0,
      startY: 0,
      mode: "spin" as "spin" | "pan",
      panOrigin: { x: 0, y: 0 },
      accumulator: 0,
    });
    const pinchRef = useRef({ active: false, prevDist: 0 });
    const lastTapRef = useRef(0);

    const clampZoom = useCallback(
      (value: number) => Math.min(maxZoom, Math.max(minZoom, value)),
      [minZoom, maxZoom],
    );

    const resetView = useCallback(() => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        zoomIn: () => setZoom((z) => clampZoom(z + ZOOM_STEP)),
        zoomOut: () =>
          setZoom((z) => {
            const next = clampZoom(z - ZOOM_STEP);
            if (next <= 1.01) {
              setPan({ x: 0, y: 0 });
              return 1;
            }
            return next;
          }),
        resetView,
      }),
      [clampZoom, resetView],
    );

    // ── Pointer spin / pan ──────────────────────────────────────────
    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;

      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        resetView();
        lastTapRef.current = 0;
        onInteract?.();
        return;
      }
      lastTapRef.current = now;

      dragRef.current = {
        active: true,
        spinStarted: false,
        startX: e.clientX,
        startY: e.clientY,
        mode: zoom > 1.05 ? "pan" : "spin",
        panOrigin: { ...pan },
        accumulator: 0,
      };
      setIsDragging(true);
      rootRef.current?.setPointerCapture(e.pointerId);
      onInteract?.();
    };

    const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d.active || disabled) return;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (d.mode === "pan") {
        setPan({
          x: d.panOrigin.x + dx,
          y: d.panOrigin.y + dy,
        });
        return;
      }

      if (!d.spinStarted) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        d.spinStarted = true;
        d.startX = e.clientX;
        d.accumulator = 0;
      }

      // Drag right → higher frame index (matches Flutter / 360_tool).
      d.accumulator -= e.movementX;
      const frameDelta = Math.round(d.accumulator / sensitivity);
      if (frameDelta !== 0) {
        d.accumulator -= frameDelta * sensitivity;
        onDragFrames(frameDelta);
      }
    };

    const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      dragRef.current.spinStarted = false;
      setIsDragging(false);
      try {
        rootRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // capture may already be released
      }
    };

    // ── Wheel zoom ──────────────────────────────────────────────────
    const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      onInteract?.();
      const factor = 1 - e.deltaY * 0.001;
      setZoom((z) => {
        const next = clampZoom(z * factor);
        if (next <= 1.01) {
          setPan({ x: 0, y: 0 });
          return 1;
        }
        return next;
      });
    };

    // ── Pinch zoom (native touch) ───────────────────────────────────
    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const pinchDist = (touches: TouchList) => {
        const a = touches[0];
        const b = touches[1];
        return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      };

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          pinchRef.current = { active: true, prevDist: pinchDist(e.touches) };
          dragRef.current.active = false;
          setIsDragging(false);
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!pinchRef.current.active || e.touches.length !== 2) return;
        e.preventDefault();
        onInteract?.();
        const dist = pinchDist(e.touches);
        if (pinchRef.current.prevDist > 0) {
          const ratio = dist / pinchRef.current.prevDist;
          setZoom((z) => {
            const next = clampZoom(z * ratio);
            if (next <= 1.01) {
              setPan({ x: 0, y: 0 });
              return 1;
            }
            return next;
          });
        }
        pinchRef.current.prevDist = dist;
      };

      const onTouchEnd = () => {
        if (pinchRef.current.active) {
          pinchRef.current = { active: false, prevDist: 0 };
        }
      };

      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd);
      el.addEventListener("touchcancel", onTouchEnd);
      return () => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
        el.removeEventListener("touchcancel", onTouchEnd);
      };
    }, [clampZoom, onInteract]);

    return (
      <div
        ref={rootRef}
        role="img"
        aria-label="عرض 360 درجة للسيارة — اسحب للتدوير"
        className={cn(
          "relative w-full h-full overflow-hidden select-none touch-none",
          "bg-[#06142d]",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          disabled && "pointer-events-none",
          className,
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          {src ? (
            // Plain <img>: frames come from CDN / API origin and switch
            // rapidly — next/image is not suitable for 36+ frame spinning.
            //
            // IMPORTANT: use w-full h-full + object-contain (not max-w/max-h).
            // max-* only *shrinks* images to the box; smaller tiers (low 360px)
            // stay tiny while high/original frames fill the stage — which looks
            // like the car "jumps" size between frames. Full-box + contain
            // scales every frame to the same viewport bounds.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              draggable={false}
              className={cn(
                "absolute inset-0 w-full h-full object-contain pointer-events-none",
                "transition-opacity duration-150",
                isApproximate ? "opacity-60" : "opacity-100",
              )}
            />
          ) : null}
        </div>
      </div>
    );
  },
);

export default Car360Viewer;
