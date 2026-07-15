"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type FilterAccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
  variant?: "default" | "nested";
  dense?: boolean;
  className?: string;
};

export default function FilterAccordion({
  title,
  children,
  defaultOpen = false,
  activeCount = 0,
  variant = "default",
  dense = false,
  className,
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || activeCount > 0);

  useEffect(() => {
    if (activeCount > 0) {
      setIsOpen(true);
    }
  }, [activeCount]);

  return (
    <div
      className={cn(
        "border-b border-gray-100 last:border-b-0",
        variant === "nested" && "border-none",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className={cn(
          "w-full flex items-center justify-between gap-2 text-right cursor-pointer select-none transition-colors hover:text-primary-600",
          dense ? "py-2" : variant === "default" ? "py-3" : "py-2",
        )}
      >
        <span
          className={cn(
            "text-gray-900 text-right leading-[100%]",
            variant === "default"
              ? "text-sm font-medium"
              : "text-xs font-medium text-gray-600",
          )}
        >
          {title}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {activeCount > 0 ? (
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          ) : null}
          <Image
            src={
              isOpen
                ? "/assets/arrow_up_faq.svg"
                : "/assets/arrow_down_faq.svg"
            }
            alt=""
            width={variant === "default" ? 14 : 12}
            height={variant === "default" ? 14 : 12}
            className="opacity-60"
          />
        </div>
      </button>
      {isOpen ? (
        <div
          className={cn(
            "flex flex-col",
            dense ? "gap-2 pb-2" : "gap-3",
            !dense && (variant === "default" ? "pb-3" : "pb-2 pr-1"),
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}