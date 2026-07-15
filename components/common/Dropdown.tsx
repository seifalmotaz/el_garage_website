"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type Option = {
  label: string;
  value: string;
};

interface DropdownProps {
  placeholder: string;
  label?: string;
  options: Option[];
  option: string;
  setOption: (value: string) => void;
  className?: string;
  variant?: "blurry" | "white" | "gray";
}

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

const MENU_GAP = 8;
const MENU_MAX_HEIGHT = 240;

export default function Dropdown({
  placeholder,
  label,
  options,
  option,
  setOption,
  className,
  variant = "blurry",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP;
    const spaceAbove = rect.top - MENU_GAP;
    const openUpward = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.min(
      MENU_MAX_HEIGHT,
      openUpward ? spaceAbove : spaceBelow,
    );

    const resolvedMaxHeight = Math.max(maxHeight, 120);

    setMenuPosition({
      left: rect.left,
      width: rect.width,
      top: openUpward
        ? Math.max(MENU_GAP, rect.top - MENU_GAP - resolvedMaxHeight)
        : rect.bottom + MENU_GAP,
      maxHeight: resolvedMaxHeight,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        (target as Element).closest?.("[data-dropdown-menu]")
      ) {
        return;
      }
      setOpen(false);
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updateMenuPosition]);

  const handleSelect = (value: string) => {
    setOption(value);
    setOpen(false);
  };

  const selectedOption = options.find((o) => o.value === option);

  const menu = (
    <AnimatePresence>
      {open && menuPosition && (
        <motion.ul
          role="listbox"
          data-dropdown-menu
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
            width: menuPosition.width,
            maxHeight: menuPosition.maxHeight,
            zIndex: 9999,
          }}
          className={cn(
            "space-y-1 rounded-2xl shadow-lg py-1 overflow-y-auto overscroll-contain",
            variant === "blurry"
              ? "dropdown-scroll-dark bg-black/80 backdrop-blur-xl border border-white/10"
              : "dropdown-scroll-light bg-white border border-gray-100",
          )}
          data-lenis-prevent
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === option}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex items-center justify-between md:min-h-[44px] min-h-[40px] rounded-xl mx-1 px-3 md:text-[14px] text-[12px] font-medium cursor-pointer transition-colors",
                variant === "blurry" ? "text-white" : "text-gray-900",
                variant === "blurry"
                  ? opt.value === option
                    ? "bg-white/15"
                    : "hover:bg-white/10"
                  : opt.value === option
                    ? "bg-[#f1f1f1]"
                    : "hover:bg-[#f8f8f8]",
              )}
            >
              {opt.label}
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full flex flex-col gap-2", className)}
    >
      {label ? (
        <label
          className={cn(
            "block text-sm uppercase font-medium leading-normal",
            variant === "blurry" ? "text-white" : "text-black",
          )}
        >
          {label}
        </label>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (next) {
              requestAnimationFrame(updateMenuPosition);
            }
            return next;
          });
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 h-[50px] rounded-2xl text-sm cursor-pointer transition-all outline-none",
          variant === "blurry"
            ? "bg-black/20"
            : variant === "gray"
              ? "bg-[#F9FAFB]"
              : "bg-white border border-[#F2F2F2]",
        )}
      >
        <span
          className={cn(
            "text-[12px] leading-[100%] uppercase font-medium truncate",
            variant === "blurry"
              ? selectedOption
                ? "text-white"
                : "text-white/60"
              : selectedOption
                ? "text-black"
                : "text-black/60",
          )}
        >
          {selectedOption?.label || placeholder}
        </span>
        <Image
          src={
            variant === "blurry"
              ? "/assets/chevron_down.svg"
              : "/assets/arrow_down_black.svg"
          }
          alt=""
          width={12}
          height={6}
          className={cn("shrink-0 duration-300", open ? "rotate-180" : "")}
        />
      </button>

      {mounted && typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}