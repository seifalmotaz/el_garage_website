"use client";

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  type ReactNode,
} from "react";
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
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  renderOption?: (option: Option, isSelected: boolean) => ReactNode;
  renderTrigger?: (selected: Option | undefined) => ReactNode;
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
      searchable = false,
      searchPlaceholder = "ابحث...",
      emptyMessage = "لا توجد نتائج",
      renderOption,
      renderTrigger,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

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

    useEffect(() => {
      if (open && searchable) {
        // Defer focus until after the panel mounts.
        const t = setTimeout(() => searchInputRef.current?.focus(), 10);
        return () => clearTimeout(t);
      }
      if (!open) {
        setSearch("");
      }
    }, [open, searchable]);

    const handleSelect = (optValue: string) => {
      onChange?.({ target: { name, value: optValue }, type: "change" });
      setOpen(false);
      triggerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const selectedOption = options.find((o) => o.value === value);

    const filteredOptions = searchable
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.trim().toLowerCase()),
        )
      : options;

    return (
      <div
        className={cn("custom-input w-full", className)}
        onKeyDown={handleKeyDown}
      >
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
            ref={triggerRef}
            id={name}
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cn(
              "w-full flex items-center border-[#F2F2F2] justify-between gap-2 px-3 h-[50px] bg-white rounded-2xl border text-sm cursor-pointer outline-none",
              error ? "border-red-500!" : " focus:border-gray-300",
            )}
            style={{ transition: "border 300ms" }}
          >
            <span
              className={cn(
                "flex-1 flex items-center gap-2 text-[14px] leading-[100%] font-light truncate text-start",
                selectedOption ? "text-black" : "text-gray-300",
              )}
            >
              {renderTrigger ? (
                renderTrigger(selectedOption) ?? (
                  <span>{selectedOption?.label || placeholder}</span>
                )
              ) : (
                <span>{selectedOption?.label || placeholder}</span>
              )}
            </span>
            <Image
              src="/assets/arrow_down_gray.svg"
              alt="down"
              width={12}
              height={6}
              className={cn(
                "opacity-70 duration-300 shrink-0",
                open ? "rotate-180" : "",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-[60px] left-0 z-50 w-full bg-white shadow-lg rounded-2xl overflow-hidden"
              >
                {searchable && (
                  <div className="relative border-b border-gray-100">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full h-11 px-3 pe-9 text-[13px] font-light text-gray-800 outline-none bg-transparent text-start"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
                    />
                    <Image
                      src="/assets/search_normal.svg"
                      alt="search"
                      width={14}
                      height={14}
                      className="absolute top-1/2 -translate-y-1/2 end-3 opacity-50 pointer-events-none"
                    />
                  </div>
                )}

                <ul
                  role="listbox"
                  data-lenis-prevent
                  className="custom-scroll space-y-1 overscroll-contain md:max-h-[300px] max-h-[200px] overflow-y-auto py-1"
                >
                  {filteredOptions.length === 0 ? (
                    <li className="px-3 py-4 text-center text-[12px] font-light text-gray-400">
                      {emptyMessage}
                    </li>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isSelected = opt.value === value;
                      return (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(opt.value)}
                          className={cn(
                            "flex items-center justify-between md:h-[50px] h-[48px] rounded-2xl mx-1 px-3 md:text-[14px] text-[12px] font-medium cursor-pointer transition-colors",
                            isSelected
                              ? "bg-[#f1f1f1]"
                              : "hover:bg-[#f8f8f8]",
                          )}
                        >
                          {renderOption
                            ? renderOption(opt, isSelected)
                            : opt.label}
                        </li>
                      );
                    })
                  )}
                </ul>
              </motion.div>
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