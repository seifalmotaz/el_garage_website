"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Spinner from "./Spinner";

export type ButtonVariants =
  | "black"
  | "primary"
  | "secondary"
  | "ghost"
  | "error"
  | "primaryDark"
  | "white";

const VARIANTS = {
  black: "bg-[#1A1A1A] text-white",
  primary: "bg-primary-500 text-white",
  secondary: "bg-primary-50 text-primary-500",
  ghost: "",
  error: "bg-red-500 text-white",
  primaryDark: "bg-[#06142D] text-white",
  white: "bg-white text-white",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement | null>;
  isLoading?: boolean;
  spinnerVariant?: "white" | "primary";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className,
  isLoading,
  spinnerVariant,
  ref,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "text-center font-bold text-nowrap w-full hover:opacity-95 px-2 group py-3 cursor-pointer rounded-2xl leading-[100%] tracking-[0.6px] duration text-sm relative overflow-hidden",
        props.disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "",
        VARIANTS[variant],
        className,
      )}
      ref={ref}
    >
      {isLoading ? <Spinner variant={spinnerVariant} /> : children}
    </button>
  );
};

export default Button;
