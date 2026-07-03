"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl lg:px-[52px] px-5",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
