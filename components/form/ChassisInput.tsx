"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";

export type ChassisInputProps = {
  label?: string;
  error?: string;
  className?: string;
  name?: string;
  value?: string;
  onChange?: (e: {
    target: { name?: string; value: string };
    type: "change";
  }) => void;
  onBlur?: (e: {
    target: { name?: string; value: string };
    type: "blur";
  }) => void;
  /** VIN standard forbids I, O, Q (too easily confused with 1, 0). Default true. */
  vinStrict?: boolean;
};

const SEGMENTS = [
  { len: 4, placeholder: "WWWW" },
  { len: 4, placeholder: "WWWW" },
  { len: 4, placeholder: "WWWW" },
  { len: 5, placeholder: "WWWWW" },
];

const TOTAL_LEN = SEGMENTS.reduce((sum, s) => sum + s.len, 0); // 17

const splitIntoSegments = (value: string) => {
  const chars = value.split("");
  const segments: string[] = [];
  let cursor = 0;
  for (const s of SEGMENTS) {
    segments.push(chars.slice(cursor, cursor + s.len).join(""));
    cursor += s.len;
  }
  return segments;
};

const sanitize = (raw: string, vinStrict: boolean) => {
  let cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (vinStrict) cleaned = cleaned.replace(/[IOQ]/g, "");
  return cleaned;
};

const ChassisInput = React.forwardRef<HTMLInputElement, ChassisInputProps>(
  (
    {
      label,
      error,
      className,
      name,
      value = "",
      onChange,
      onBlur,
      vinStrict = true,
    },
    forwardedRef,
  ) => {
    const [segments, setSegments] = useState<string[]>(() =>
      splitIntoSegments(value),
    );
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync from outside (e.g. form reset / defaultValues) without clobbering active typing
    useEffect(() => {
      const current = segments.join("");
      if (
        value !== current &&
        document.activeElement &&
        !wrapperRef.current?.contains(document.activeElement)
      ) {
        setSegments(splitIntoSegments(value));
      }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const emitChange = (nextSegments: string[]) => {
      setSegments(nextSegments);
      onChange?.({
        target: { name, value: nextSegments.join("") },
        type: "change",
      });
    };

    const focusSegment = (index: number, atStart = false) => {
      const el = inputRefs.current[index];
      if (!el) return;
      el.focus();
      if (!atStart)
        requestAnimationFrame(() =>
          el.setSelectionRange(el.value.length, el.value.length),
        );
    };

    const handleSegmentChange = (index: number, raw: string) => {
      const clean = sanitize(raw, vinStrict).slice(0, SEGMENTS[index].len);
      const next = [...segments];
      next[index] = clean;
      emitChange(next);

      if (clean.length === SEGMENTS[index].len && index < SEGMENTS.length - 1) {
        focusSegment(index + 1);
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      const el = e.currentTarget;

      if (
        e.key === "Backspace" &&
        el.selectionStart === 0 &&
        el.selectionEnd === 0 &&
        index > 0
      ) {
        e.preventDefault();
        const next = [...segments];
        next[index - 1] = next[index - 1].slice(0, -1);
        emitChange(next);
        focusSegment(index - 1);
        return;
      }

      if (e.key === "ArrowLeft" && el.selectionStart === 0 && index > 0) {
        e.preventDefault();
        focusSegment(index - 1);
      }

      if (
        e.key === "ArrowRight" &&
        el.selectionStart === el.value.length &&
        index < SEGMENTS.length - 1
      ) {
        e.preventDefault();
        focusSegment(index + 1, true);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const clean = sanitize(e.clipboardData.getData("text"), vinStrict).slice(
        0,
        TOTAL_LEN,
      );
      const next = splitIntoSegments(clean);
      emitChange(next);

      const filledLen = clean.length;
      let acc = 0;
      let targetIndex = SEGMENTS.length - 1;
      for (let i = 0; i < SEGMENTS.length; i++) {
        acc += SEGMENTS[i].len;
        if (filledLen < acc) {
          targetIndex = i;
          break;
        }
      }
      requestAnimationFrame(() => focusSegment(targetIndex));
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
        onBlur?.({ target: { name, value: segments.join("") }, type: "blur" });
      }
    };

    return (
      <div className={cn("custom-input w-full", className)}>
        <div className="flex items-center mb-2">
          {label && (
            <label className="text-black capitalize leading-[24px] text-[14px] inline-block">
              {label}
            </label>
          )}
        </div>

        <div className="relative">
          <div
            ref={wrapperRef}
            onBlur={handleBlur}
            dir="ltr"
            className="flex flex-wrap items-center gap-1 justify-between"
          >
            {SEGMENTS.map((seg, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                  if (index === 0) {
                    if (typeof forwardedRef === "function") forwardedRef(el);
                    else if (forwardedRef) forwardedRef.current = el;
                  }
                }}
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                maxLength={seg.len}
                placeholder={seg.placeholder}
                value={segments[index]}
                onChange={(e) => handleSegmentChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                style={{ transition: "border 300ms" }}
                className={cn(
                  "text-center h-[50px] bg-white rounded-2xl border border-[#F2F2F2] text-black outline-none tracking-widest font-medium uppercase",
                  "placeholder:text-gray-300 placeholder:font-light placeholder:tracking-widest",
                  error ? "border-red-500!" : "focus:border-gray-300",
                  seg.len === 5 ? "flex-[1.25]" : "flex-1",
                )}
              />
            ))}
          </div>

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

ChassisInput.displayName = "ChassisInput";
export default ChassisInput;
