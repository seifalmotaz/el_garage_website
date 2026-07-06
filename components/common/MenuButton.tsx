"use client";
import { cn } from "@/lib/utils";

const Bar = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg
      width="20"
      height="2"
      viewBox="0 0 20 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.75 0.75H18.75"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const MenuButton = ({
  open,
  setOpen,
  // isNavFixed,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // isNavFixed: boolean;
}) => {
  return (
    <div
      className="relative h-3 w-9 cursor-pointer lg:hidden"
      onClick={() => setOpen((p) => !p)}
    >
      <Bar
        className={cn(
          "absolute h-0.25 w-5 left-1/2 -translate-x-1/2 top-0 duration-500 bg-white",
          // isNavFixed ? "bg-black" : "bg-white",
          open ? "rotate-45 translate-y-1.5" : "",
        )}
      />
      <Bar
        className={cn(
          "absolute h-0.5 w-5 left-1/2 -translate-x-1/2 top-1.5 duration-500 bg-white",
          // isNavFixed ? "bg-black" : "bg-white",
          open ? "-translate-x-8 opacity-0" : "opacity-100",
        )}
      />
      <Bar
        className={cn(
          "absolute h-0.25 w-5 left-1/2 -translate-x-1/2 top-3 duration-500 bg-white",
          // isNavFixed ? "bg-black" : "bg-white",
          open ? "-rotate-45 -translate-y-1.5" : "",
        )}
      />
    </div>
  );
};

export default MenuButton;
