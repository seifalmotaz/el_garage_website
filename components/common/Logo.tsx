import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-1.25", className)}>
      <div className="relative w-[117px] h-[16px]">
        <Image
          src="/assets/logo_text.svg"
          alt="elGARAGE"
          fill
          className="object-contain"
        />
      </div>
      <div className="relative w-8 h-8">
        <Image
          src="/assets/logo_shield.svg"
          alt="elGARAGE Logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
