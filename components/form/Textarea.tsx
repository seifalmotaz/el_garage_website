import { cn } from "@/lib/utils";
import React, { useState } from "react";

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    initialHeight?: number;
    maxLength: number;
  };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      error,
      label,
      initialHeight = 109,
      maxLength,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const getInitialLength = () => {
      if (value !== undefined) return String(value).length;
      if (defaultValue !== undefined) return String(defaultValue).length;
      return 0;
    };

    const [charCount, setCharCount] = useState(getInitialLength);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn("custom-textarea", className)}>
        <div className="flex items-center gap-3 mb-[6px]">
          {label && (
            <label
              htmlFor={label}
              className="text-black capitalize leading-[27px] text-sm inline-block"
            >
              {label}
            </label>
          )}
        </div>

        <div className="relative" style={{ height: `${initialHeight}px` }}>
          <textarea
            ref={ref}
            style={{
              transition: "border 300ms",
              resize: "none",
            }}
            id={label}
            name={label}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              "w-full h-full border border-[#F2F2F2] rounded-2xl focus:border-gray-300 text-black lg:px-5 px-2.5 py-3 outline-none placeholder:text-[#8A8A8A] placeholder:leading-[24px] placeholder:text-sm overflow-y-auto",
              error ? "border-red-500!" : "",
            )}
            onChange={handleChange}
            {...props}
            data-lenis-prevent
          />

          <div className="absolute left-0 w-full bottom-0 translate-y-full flex items-start justify-between pt-1.5">
            {error ? (
              <p className="text-red-500 text-xs leading-[100%]">{error}</p>
            ) : (
              <span />
            )}
            <p className="text-[#8A8A8A] text-[12px] leading-[100%]">
              {maxLength - charCount} حرف متبقي
            </p>
          </div>
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
