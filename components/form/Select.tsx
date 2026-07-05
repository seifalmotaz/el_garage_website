"use client";

import { useRef, useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type Option = {
  label: string;
  value: string;
};

export type SelectProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  error?: string;
  className?: string;
  name?: string;
  value?: string;
  onChange?: (...event: any[]) => void;
  onBlur?: (...event: any[]) => void;
};

const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      label,
      placeholder = "اختر",
      options,
      error,
      className,
      name,
      value,
      onChange,
      onBlur,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          if (open) {
            onBlur?.({ target: { name, value }, type: "blur" });
          }
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open, name, value, onBlur]);

    const handleSelect = (optValue: string) => {
      onChange?.({ target: { name, value: optValue }, type: "change" });
      setOpen(false);
    };

    const selectedOption = options.find((o) => o.value === value);

    return (
      <div className={cn("custom-input w-full", className)}>
        <div className="flex items-center mb-2">
          {label && (
            <label
              htmlFor={name}
              className="text-black capitalize leading-[24px] text-[14px] inline-block"
            >
              {label}
            </label>
          )}
        </div>

        <div className="relative" ref={wrapperRef}>
          {/* Hidden field so `ref` (register) attaches to a real form control */}
          <input
            ref={ref}
            type="hidden"
            name={name}
            value={value ?? ""}
            readOnly
          />

          {/* Trigger */}
          <button
            type="button"
            id={name}
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
              "w-full flex items-center border-[#F2F2F2] justify-between gap-2 px-3 h-[50px] bg-white rounded-2xl border text-sm cursor-pointer outline-none",
              error ? "border-red-500!" : " focus:border-gray-300",
            )}
            style={{ transition: "border 300ms" }}
          >
            <span
              className={cn(
                "text-[14px] leading-[100%] font-light",
                selectedOption ? "text-black" : "text-gray-300",
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
            <Image
              src="/assets/arrow_down_gray.svg"
              alt="down"
              width={12}
              height={6}
              className={cn(
                "opacity-70 duration-300",
                open ? "rotate-180" : "",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {open && (
              <motion.ul
                role="listbox"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="custom-scroll absolute top-[60px] space-y-1 rounded-2xl left-0 z-50 overscroll-contain w-full bg-[#f3f3f3] shadow-lg py-1 md:max-h-[300px] max-h-[200px] overflow-y-auto"
                data-lenis-prevent
              >
                {options.map((opt) => (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={opt.value === value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex items-center justify-between md:h-[50px] h-[48px] rounded-2xl mx-1 px-3 md:text-[14px] text-[12px] font-medium cursor-pointer transition-colors",
                      opt.value === value
                        ? "bg-[#dfdfdf]"
                        : "hover:bg-[#e9e9e9]",
                    )}
                  >
                    {opt.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Error */}
          <div className="absolute left-0 w-full bottom-0 translate-y-full">
            {error && (
              <p className="text-red-500 text-[12px] font-light leading-[100%] pt-[3px]">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
