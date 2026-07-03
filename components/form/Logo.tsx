import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-[10px] w-fit self-center"
      dir="ltr"
    >
      <div className="relative w-11 h-11">
        <Image
          src="/assets/logo_shield_color.svg"
          alt="elGARAGE Logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="relative w-[160px] h-[22px]">
        <Image
          src="/assets/logo_text_dark.svg"
          alt="elGARAGE"
          fill
          className="object-contain"
        />
      </div>
    </Link>
  );
};

export default Logo;
