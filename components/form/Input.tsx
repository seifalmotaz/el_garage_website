import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wachedValue?: string;
  fieldName?: string;
  children?: ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      children,
      error,
      label,
      wachedValue,
      fieldName,
      min = 0,
      max = Infinity,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("custom-input w-full", className)}>
        <div className="flex items-center mb-2">
          {label && (
            <label
              htmlFor={label}
              className=" text-black capitalize leading-[24px] text-[14px] inline-block"
            >
              {label}
            </label>
          )}
        </div>

        <div className="relative">
          <input
            ref={ref}
            style={{ transition: "border 300ms" }}
            id={label}
            name={label}
            placeholder={props.placeholder}
            className={cn(
              "w-full border h-[50px] bg-gray-50 rounded-2xl border-transparent text-black outline-none placeholder:text-gray-300 placeholder:leading-[32px] placeholder:text-[14px] placeholder:font-light",
              error ? "border-red-500!" : "focus:border-gray-300",
              children ? (props.type === "tel" ? "px-13" : "px-11") : "px-3",
            )}
            {...props}
          />
          {children}
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

Input.displayName = "Input";
export default Input;
