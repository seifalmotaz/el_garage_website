"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CarCardProps = {
  id?: string;
  image?: string;
  brand: string;
  model: string;
  price: string;
  installment?: string;
  year: string;
  mileage: string;
  trim: string;
  location: string;
  isFeatured?: boolean;
  isCertified?: boolean;
  discountText?: string;
};

export default function CarCard({
  id,
  image = "/assets/car_placeholder.png",
  brand,
  model,
  price,
  installment = "12,444",
  year,
  mileage,
  trim,
  location,
  isFeatured = false,
  isCertified = true,
  discountText,
}: CarCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link
      href={`/cars/${id || "bmw-x5"}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative group select-none gap-[10px]"
    >
      {/* Top Section: Image and Badges */}
      <div className="relative h-[165px] overflow-hidden rounded-xl mx-[4px] mt-[4px]">
        <Image
          src={image}
          alt={`${brand} ${model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
        />

        {/* Favorite & Video CTAs */}
        <div className="absolute top-3 right-3 flex flex-col gap-4 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={cn(
              "w-8 h-8 rounded-full bg-black/25 backdrop-blur-[5px] flex items-center justify-center hover:bg-black/40 transition-colors",
              isLiked ? "bg-red-500" : "",
            )}
          >
            <Image
              src="/assets/favourite_heart.svg"
              alt="favorite"
              width={18}
              height={18}
              className={`w-4.5 h-4.5 transition-colors ${isLiked ? "brightness-125 saturate-150 scale-110" : "opacity-80"}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-black/25 backdrop-blur-[5px] flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <Image
              src="/assets/play_video.svg"
              alt="play"
              width={16}
              height={16}
              className="w-4 h-4 opacity-80"
            />
          </button>
        </div>

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-[-4px] bg-lime-200 text-lime-700 text-xs w-[58px] h-5 flex items-center justify-center rounded-br-[4px] rounded-tr-[4px] shadow-sm">
            مميز
          </div>
        )}
      </div>

      {/* Middle Section: Info & Specs */}
      <div className="flex-1 flex flex-col justify-between gap-[24px] text-start px-4">
        {/* Title & Price Row */}
        <div className="flex items-start justify-between gap-2 w-full">
          {/* Title & Discount (Right side in RTL) */}
          <div className="flex flex-col gap-2 items-start flex-1 min-w-0">
            <h3 className="font-medium text-base text-[#1a1a1a] line-clamp-2 text-start w-[167px]">
              {brand}-{model}
            </h3>
            {discountText && (
              <span className="bg-red-600 flex justify-center items-center text-white font-normal text-xs py-1 px-2 rounded-full whitespace-nowrap">
                {discountText}
              </span>
            )}
          </div>

          {/* Price & Installment (Left side in RTL) */}
          <div className="flex flex-col items-center gap-1 shrink-0 text-end">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary-600">
                {price}
              </span>
              <span className="text-sm text-primary-400 font-normal">ج.م</span>
            </div>
            {installment && (
              <span className="text-sm text-gray-500 font-normal">
                {installment} شهر
              </span>
            )}
          </div>
        </div>

        {/* Specs Container */}
        <div className="flex flex-wrap items-center justify-start border-t border-gray-100 pt-3 w-full gap-[12px]">
          {/* Year */}
          <div className="flex items-center gap-1">
            <Image
              src="/assets/calendar_specs.svg"
              alt="year"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60"
            />
            <span className="text-sm text-gray-500">{year}</span>
          </div>

          {/* Mileage */}
          <div className="flex items-center gap-1">
            <Image
              src="/assets/spedometer_specs.svg"
              alt="mileage"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60"
            />
            <span className="text-sm text-gray-500">{mileage}</span>
          </div>

          {/* Location (Right side in RTL) */}
          <div className="flex items-center gap-1">
            <Image
              src="/assets/location_specs.svg"
              alt="location"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60"
            />
            <span className="text-sm text-gray-500">{location}</span>
          </div>

          {/* Trim (Left side in RTL) */}
          <div className="flex items-center gap-1">
            <Image
              src="/assets/car_specs_icon.svg"
              alt="trim"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60"
            />
            <span className="text-sm text-gray-500">{trim}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Certified Banner */}
      {isCertified && (
        <div className="bg-gradient-to-r from-[#002ec1] to-[#00165b] text-white px-4 py-2 flex items-center justify-between shadow-inner rounded-b-2xl h-11">
          {/* Certified Label on Right in RTL */}
          <div className="flex items-center gap-1.5">
            <div className="relative w-4 h-4">
              <Image
                src="/assets/certified_shield.svg"
                alt="certified"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-medium">معتمدة من جراج</span>
          </div>

          {/* Arrow on Left in RTL */}
          <div className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
            <Image
              src="/assets/arrow_left_white.svg"
              alt="view details"
              width={16}
              height={16}
              className="w-4 h-4 rotate-45"
            />
          </div>
        </div>
      )}
    </Link>
  );
}
