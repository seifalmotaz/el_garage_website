"use client";
import { cn } from "@/lib/utils";

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
      className="relative h-4 w-9 cursor-pointer lg:hidden"
      onClick={() => setOpen((p) => !p)}
    >
      <div
        className={cn(
          "absolute h-0.5 w-6 left-1/2 -translate-x-1/2 top-0 duration-500 bg-white",
          // isNavFixed ? "bg-black" : "bg-white",
          open ? "rotate-45 translate-y-2" : "",
        )}
      ></div>
      <div
        className={cn(
          "absolute h-0.5 w-6 left-1/2 -translate-x-1/2 top-2 duration-500 bg-white",
          // isNavFixed ? "bg-black" : "bg-white",
          open ? "-translate-x-8 opacity-0" : "opacity-100",
        )}
      ></div>
      <div
        className={cn(
          "absolute h-0.5 w-6 left-1/2 -translate-x-1/2 top-4 duration-500 bg-white",
          // isNavFixed ? "bg-black" : "bg-white",
          open ? "-rotate-45 -translate-y-2" : "",
        )}
      ></div>
    </div>
  );
};

export default MenuButton;
