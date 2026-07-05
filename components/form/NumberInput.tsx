"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useRef } from "react";

export type NumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  error?: string;
  step?: number;
};

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className = "",
      error,
      label,
      min = 0,
      max = Infinity,
      step = 1,
      ...props
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLInputElement>(null);

    const setRefs = (el: HTMLInputElement | null) => {
      localRef.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    const fireChange = (input: HTMLInputElement) => {
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const handleStep = (direction: "up" | "down") => {
      const input = localRef.current;
      if (!input) return;

      // stepUp/stepDown respect min/max/step natively
      if (direction === "up") {
        input.stepUp();
      } else {
        input.stepDown();
      }

      fireChange(input);
      input.focus();
    };

    return (
      <div className={cn("custom-input w-full", className)}>
        <div className="flex items-center mb-2">
          {label && (
            <label
              htmlFor={label}
              className="text-black capitalize leading-[24px] text-[14px] inline-block"
            >
              {label}
            </label>
          )}
        </div>

        <div className="relative">
          <input
            ref={setRefs}
            id={label}
            name={label}
            type="number"
            min={min}
            max={max}
            step={step}
            placeholder={props.placeholder}
            style={{ transition: "border 300ms" }}
            className={cn(
              "w-full h-[50px] bg-white rounded-2xl border-[#F2F2F2] border text-black outline-none pl-11 pr-3 font-light text-sm",
              "placeholder:text-gray-300 placeholder:leading-[32px] placeholder:text-[14px] placeholder:font-light",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              error ? "border-red-500!" : "focus:border-gray-300",
            )}
            {...props}
          />

          {/* Stepper */}
          <div className="absolute left-3 top-0 h-full flex flex-col items-center justify-center gap-1">
            <button
              type="button"
              aria-label="increment"
              tabIndex={-1}
              onClick={() => handleStep("up")}
              className="p-0.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Image
                src="/assets/arrow_down_gray.svg"
                alt="up"
                width={12}
                height={6}
                className="rotate-180"
              />
            </button>
            <button
              type="button"
              aria-label="decrement"
              tabIndex={-1}
              onClick={() => handleStep("down")}
              className="p-0.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Image
                src="/assets/arrow_down_gray.svg"
                alt="down"
                width={12}
                height={6}
              />
            </button>
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

NumberInput.displayName = "NumberInput";
export default NumberInput;
