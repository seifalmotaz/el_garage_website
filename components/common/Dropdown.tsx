import { useRef, useState, useEffect } from "react";
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
  variant?: "blurry" | "white";
}

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string, label: string) => {
    setOption(value);
    setOpen(false);
  };

  const selectedOption = options.find((o) => o.value === option);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full flex flex-col dropdown border-[#ECEDF0] gap-2",
        // label ? "md:gap-[24px] gap-[16px] " : "",
        className,
      )}
    >
      {/* Label */}
      <div className="flex justify-between items-center">
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
      </div>

      <div className="relative w-full flex-1 group">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            `w-full flex items-center justify-between gap-2 px-3 py-2 h-[50px]  rounded-2xl text-sm cursor-pointer transition-all outline-none`,
            variant === "blurry"
              ? "bg-black/20"
              : "bg-white border border-[#F2F2F2]",
          )}
        >
          <span
            className={cn(
              " text-[12px] leading-[100%] uppercase font-medium",
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
                : "/assets/arrow_down_gray.svg"
            }
            alt="down"
            width={12}
            height={6}
            className={cn(
              "opacity-70 group-hover:opacity-100 duration-300 invert lg:invert-0",
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
              className={cn(
                "custom-scroll absolute md:top-[60px] top-[unset] space-y-1 md:bottom-[unset] bottom-[60px] md:mt-[20px] rounded-2xl left-0 z-50 overscroll-contain w-full  shadow-lg py-1 md:max-h-[300px] max-h-[200px] overflow-y-auto animate-dropdown",
                variant === "blurry"
                  ? "bg-black/60 backdrop-blur-xl"
                  : "bg-[#EEEEEE]",
              )}
              data-lenis-prevent
            >
              {options.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === option}
                  onClick={() => handleSelect(opt.value, opt.label)}
                  className={cn(
                    `flex items-center justify-between md:h-[50px] h-[48px] rounded-2xl mx-1 px-3 md:text-[14px] text-[12px] font-medium cursor-pointer uppercase transition-colors`,
                    variant === "blurry" ? "text-white" : "",
                    variant === "blurry"
                      ? opt.value === option
                        ? "bg-[#555]/20"
                        : "hover:bg-[#888]/20"
                      : opt.value === option
                        ? "bg-[#d3d3d3]"
                        : "hover:bg-[#e5e5e5]",
                  )}
                >
                  {opt.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
