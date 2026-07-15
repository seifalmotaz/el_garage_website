"use client";

type ShowMoreToggleProps = {
  expanded: boolean;
  onToggle: () => void;
  hiddenCount: number;
  className?: string;
};

export default function ShowMoreToggle({
  expanded,
  onToggle,
  hiddenCount,
  className = "",
}: ShowMoreToggleProps) {
  if (hiddenCount <= 0) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-xs font-medium text-primary-500 hover:text-primary-600 text-right cursor-pointer transition-colors ${className}`}
    >
      {expanded ? "عرض أقل" : `عرض المزيد (${hiddenCount})`}
    </button>
  );
}