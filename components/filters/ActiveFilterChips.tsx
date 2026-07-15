"use client";

export type FilterChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

type ActiveFilterChipsProps = {
  chips: FilterChip[];
  onClearAll?: () => void;
  className?: string;
};

export default function ActiveFilterChips({
  chips,
  onClearAll,
  className = "",
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-500">
          الفلاتر المطبقة ({chips.length})
        </span>
        {onClearAll ? (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-primary-500 hover:text-primary-600 cursor-pointer transition-colors shrink-0"
          >
            مسح الكل
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={chip.onRemove}
            className="inline-flex items-center gap-1.5 max-w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 hover:border-primary-300 hover:bg-primary-50/50 transition-colors cursor-pointer group"
            aria-label={`إزالة فلتر ${chip.label}`}
          >
            <span className="truncate">{chip.label}</span>
            <span className="text-gray-400 group-hover:text-primary-500 text-sm leading-none shrink-0">
              ×
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}