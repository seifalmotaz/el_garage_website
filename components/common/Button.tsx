"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Spinner from "./Spinner";

export type ButtonVariants = "default" | "primary" | "outline";

const VARIANTS = {
  default: "",
  primary:
    "bg-white text-black hover:bg-white/90 hover:text-white transition-colors px-2",
  outline:
    "bg-[#FFFFFF33] hover:bg-[#1E1E1E] text-white backdrop-blur-[4.4px] border-[1.5px] border-white/30 px-2",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement | null>;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  className,
  isLoading,
  ref,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "text-center uppercase text-nowrap group cursor-pointer font-medium tracking-[0.6px] duration text-sm relative overflow-hidden",
        props.disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "",
        VARIANTS[variant],
        className,
      )}
      ref={ref}
    >
      {variant === "primary" ? (
        <img
          className="absolute w-full left-0 top-0 -translate-y-full group-hover:translate-y-0 duration-[calc(var(--duration)*1.5)]"
          src={"/images/svgs/wave.svg"}
          alt=""
        />
      ) : null}

      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
