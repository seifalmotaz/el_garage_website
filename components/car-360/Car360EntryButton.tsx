/**
 * Primary CTA that opens the 360° viewer from the car gallery.
 * Matches the app's "تشغيل" chip on the image overlay.
 */
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type Car360EntryButtonProps = {
  onClick: () => void;
  className?: string;
  /** Compact icon-only variant for tight layouts. */
  compact?: boolean;
};

export default function Car360EntryButton({
  onClick,
  className,
  compact = false,
}: Car360EntryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="عرض السيارة بزاوية 360 درجة"
      className={cn(
        "pointer-events-auto bg-primary-50 hover:bg-primary-100",
        "text-primary-500 font-semibold text-sm",
        "rounded-full flex items-center gap-2 transition-colors shadow-md cursor-pointer",
        "border border-primary-500/10",
        compact ? "md:px-4 md:py-2.5 py-2 px-3" : "md:px-8 md:py-3.5 py-2 px-3",
        className,
      )}
    >
      <div className="relative md:size-8 size-4.5 shrink-0">
        <Image src="/icons/blue-play.svg" alt="" fill />
      </div>
      <span className="text-primary-500 md:text-lg leading-7 md:font-medium">
        عرض 360°
      </span>
    </button>
  );
}
