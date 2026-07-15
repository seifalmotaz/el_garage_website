import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  leading?: ReactNode;
  compact?: boolean;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  leading,
  compact = false,
  className = "",
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center cursor-pointer select-none ${
        compact ? "gap-1.5" : "gap-2"
      } ${className}`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex items-center justify-center rounded border shrink-0 transition-colors ${
          compact ? "size-4" : "size-5"
        } ${
          checked
            ? "border-primary-500 bg-primary-500"
            : "border-gray-200 bg-white"
        }`}
      >
        {checked && (
          <Check
            className={`text-white ${compact ? "size-2.5" : "size-3.5"}`}
            strokeWidth={3}
          />
        )}
      </button>
      {leading}
      {label ? (
        <span
          className={`text-gray-700 ${compact ? "text-xs" : "text-sm"}`}
        >
          {label}
        </span>
      ) : null}
    </label>
  );
}
