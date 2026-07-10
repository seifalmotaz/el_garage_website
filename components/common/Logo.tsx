import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({
  className,
  variant = "white",
}: {
  className?: string;
  variant?: "primary" | "white";
}) => {
  return (
    <div className={cn("flex items-center gap-1.25", className)}>
      <div className="relative w-[117px] h-[16px]">
        <Image
          src={
            variant === "white"
              ? "/assets/logo_text.svg"
              : "/assets/logo_text_dark.svg"
          }
          alt="elGARAGE"
          fill
          className="object-contain"
        />
      </div>
      <div className="relative w-8 h-8">
        <Image
          src={
            variant === "white"
              ? "/assets/logo_shield.svg"
              : "/assets/logo_shield_color.svg"
          }
          alt="elGARAGE Logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
