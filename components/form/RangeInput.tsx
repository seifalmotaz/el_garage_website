"use client";
import React, { useRef, Dispatch, SetStateAction } from "react";

interface CustomRangeSliderProps {
  from: number;
  setFrom: Dispatch<SetStateAction<number>>;
  to: number;
  setTo: Dispatch<SetStateAction<number>>;
  min: number;
  max: number;
  onChange?: (values: { from: number; to: number }) => void;
}

const RangeInput: React.FC<CustomRangeSliderProps> = ({
  from,
  setFrom,
  to,
  setTo,
  min,
  max,
  onChange,
}) => {
  const rangeRef = useRef<HTMLDivElement>(null);

  const calculateValue = (clientX: number) => {
    if (!rangeRef.current) return min;
    const rect = rangeRef.current.getBoundingClientRect();
    // RTL: distance is measured from the right edge, so min sits on the right
    const offsetX = rect.right - clientX;
    const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
    return Math.round(min + percentage * (max - min));
  };

  const handleMove = (type: "from" | "to", clientX: number) => {
    const value = calculateValue(clientX);
    if (type === "from" && value <= to) setFrom(value);
    if (type === "to" && value >= from) setTo(value);
    onChange?.({ from, to });
  };

  const handleMouseDown = (type: "from" | "to") => {
    const moveHandler = (e: MouseEvent) => handleMove(type, e.clientX);
    const upHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
  };

  const handleTouchStart = (type: "from" | "to") => {
    const moveHandler = (e: TouchEvent) =>
      handleMove(type, e.touches[0].clientX);
    const upHandler = () => {
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", upHandler);
    };

    window.addEventListener("touchmove", moveHandler);
    window.addEventListener("touchend", upHandler);
  };

  const leftPercentage = ((from - min) / (max - min)) * 100;
  const rightPercentage = ((to - min) / (max - min)) * 100;

  // Mirror the logical percentages onto screen position: min is now on the right,
  // max on the left.
  const fromScreenPos = 100 - leftPercentage;
  const toScreenPos = 100 - rightPercentage;

  return (
    <div dir="rtl">
      <div
        className="relative w-[calc(100%-16px)] h-2 bg-[#EEEEEE] rounded-2xl mr-2"
        ref={rangeRef}
      >
        <div
          className="absolute h-2 bg-primary-800 rounded-2xl"
          style={{
            left: `${toScreenPos}%`,
            right: `${leftPercentage}%`,
          }}
        />
        <div
          className="absolute size-4.5 rounded-full border border-[#CACACA] bg-white top-0.5 shadow-sm shadow-black/20 transform -translate-x-1/2 -translate-y-1.5 !cursor-pointer"
          style={{ left: `${fromScreenPos}%` }}
          onMouseDown={() => handleMouseDown("from")}
          onTouchStart={() => handleTouchStart("from")}
        />
        <div
          className="absolute size-4.5 rounded-full border border-[#CACACA] bg-white top-0.5 shadow-sm shadow-black/20 transform -translate-x-1/2 -translate-y-1.5 !cursor-pointer"
          style={{ left: `${toScreenPos}%` }}
          onMouseDown={() => handleMouseDown("to")}
          onTouchStart={() => handleTouchStart("to")}
        />
      </div>
      <div className="flex justify-between items-center mt-4 text-sm select-none text-primary-800">
        <span>{from}</span>
        <span>{to}كيلو</span>
      </div>
    </div>
  );
};

export default RangeInput;
