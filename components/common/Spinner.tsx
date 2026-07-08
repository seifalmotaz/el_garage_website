import { cn } from "@/lib/utils";

const Spinner = ({ variant = "white" }: { variant?: "white" | "primary" }) => {
  return (
    <span
      className={cn(
        "spinner",
        variant === "white" ? "" : "border-primary-500! border-b-transparent!",
      )}
    ></span>
  );
};

export default Spinner;
