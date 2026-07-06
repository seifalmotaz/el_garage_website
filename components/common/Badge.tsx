import { cn } from "@/lib/utils";

const Badge = ({
  status,
  text,
}: {
  status?: "completed" | "canceled" | "pending";
  text: string;
}) => {
  return (
    <span
      className={cn(
        "text-[10px] rounded-full leading-[150%] px-2 py-[4.5px]",
        status === "completed"
          ? "bg-teal-100 text-teal-500"
          : status === "pending"
            ? "bg-yellow-100 text-yellow-500"
            : "bg-red-100 text-red-500",
      )}
    >
      {text}
    </span>
  );
};

export default Badge;
