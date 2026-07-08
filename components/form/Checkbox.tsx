import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  className = "",
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex items-center justify-center size-5 rounded border-2 shrink-0 transition-colors ${
          checked ? "border-primary-500 bg-primary-500" : "border-gray-300"
        }`}
      >
        {checked && <Check className="size-3.5 text-white" strokeWidth={3} />}
      </button>
      {label && <span className="text-sm text-black">{label}</span>}
    </label>
  );
}
