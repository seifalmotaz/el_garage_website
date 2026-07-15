import { cn } from "@/lib/utils";

type BrandLogoProps = {
  logo: string | null;
  name: string;
  className?: string;
};

const BrandLogo = ({ logo, name, className }: BrandLogoProps) => (
  <span
    className={cn(
      "size-7 shrink-0 flex items-center justify-center rounded-lg bg-white p-1 shadow-xs",
      className,
    )}
  >
    {logo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} alt={name} className="size-full object-contain" />
    ) : (
      <span className="text-primary-500 text-[11px] font-bold">
        {name.charAt(0)}
      </span>
    )}
  </span>
);

export default BrandLogo;