"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, TagIcon } from "../svg/Svgs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MenuButton from "./MenuButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Header({
  activeHref,
  variant = "light",
}: {
  activeHref?: string;
  variant?: "light" | "dark";
}) {
  const [showHeader, setShowHeader] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/auth/")) setShowHeader(true);
  }, [pathname]);

  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "الصفحة الرئيسية", href: "/" },
    { label: "تصفح السيارات", href: "/cars" },
    { label: "السيارات المميزة", href: "/#grid-featured" },
    { label: "المقالات", href: "/blog" },
    { label: "الأسئلة الشائعة", href: "/#faq" },
    { label: "تواصل معنا", href: "/#footer" },
  ];

  return !showHeader ? (
    <></>
  ) : (
    <MaxWidthWrapper className="fixed z-50 w-full pt-6">
      <header
        className={cn(
          "relative",
          variant === "dark"
            ? "top-12 left-5 right-5 w-[calc(100%-40px)] lg:top-6 lg:left-1/2 lg:right-auto"
            : "top-0 lg:top-6 left-0 w-full",
        )}
      >
        <div
          className={`
        ${
          variant === "dark"
            ? menuOpen
              ? "bg-transparent border-none rounded-[20px] lg:rounded-2xl px-3.5 lg:px-6 py-2 lg:py-4 h-[60px] lg:h-auto"
              : "backdrop-blur-md bg-[#000000]/30 border border-white/10 rounded-[20px] lg:rounded-2xl px-3.5 lg:px-6 py-2 lg:py-4 h-[60px] lg:h-auto"
            : menuOpen
              ? "bg-transparent border-none rounded-none lg:rounded-2xl px-6 py-4"
              : "bg-white lg:backdrop-blur-md lg:bg-black/20 lg:border lg:border-white/10 border-b border-gray-100 lg:border-none rounded-none lg:rounded-2xl px-6 py-4"
        }
        flex items-center justify-between lg:shadow-lg w-full relative z-50
      `}
        >
          {/* Right: Logo (Placed first to align rightmost under RTL flow) */}
          <Link href="/" className="flex items-center gap-3 z-50">
            {/* Mobile Logo Shield & Text */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src={
                    variant === "dark" && !menuOpen
                      ? "/assets/logo_shield.svg"
                      : "/assets/logo_shield_color.svg"
                  }
                  alt="elGARAGE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-[117px] h-[16px]">
                <Image
                  src={
                    variant === "dark" && !menuOpen
                      ? "/assets/logo_text.svg"
                      : "/assets/logo_text_dark.svg"
                  }
                  alt="elGARAGE"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* Desktop Logo Shield & Text */}
            <div className="relative w-8 h-8">
              <Image
                src="/logo-part.svg"
                alt="elGARAGE Logo"
                fill
                className="xl:hidden max-lg:hidden"
              />
            </div>
            <div className="hidden xl:flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/logo_shield.svg"
                  alt="elGARAGE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-[117px] h-[16px]">
                <Image
                  src="/assets/logo_text.svg"
                  alt="elGARAGE"
                  fill
                  className="object-contain"
                />
              </div>
            </div>{" "}
          </Link>

          {/* Center: Navigation - Hidden on Mobile, shown on Large Screens */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-3 xl:gap-8">
            {navItems.map((item, idx) => {
              const isActive = activeHref
                ? item.href === activeHref ||
                  (item.href === "/" && activeHref === "/")
                : idx === 0;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`text-white hover:text-white/80 text-sm lg:text-[12px] 2xl:text-sm font-medium transition-colors duration-200 ${
                    isActive ? "font-bold border-b-2 border-white pb-1" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Left: Actions - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer">
              <SearchIcon />
            </button>
            <Link
              href="#"
              className="text-white hover:text-white/80 font-medium text-sm transition-colors duration-200"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/sell"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-[16px] px-6 py-3 rounded-2xl flex items-center gap-2 transition-colors duration-200"
            >
              <TagIcon />
              <span>بيع سيارتك</span>
            </Link>
          </div>

          {/* Hamburger Menu Icon (Shown on Mobile on Left side of flow - placed last to render leftmost under RTL flow) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-11 h-11 bg-primary-500 hover:bg-primary-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-md z-50"
          >
            <MenuButton open={menuOpen} setOpen={setMenuOpen} />
          </button>
        </div>

        {/* Mobile Drawer Menu Overlay */}
        {/* {menuOpen && ( */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 bg-white z-40 flex flex-col justify-between pt-24 px-8 pb-12 shadow-2xl duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Drawer Links */}
          <div className="flex flex-col gap-6 text-start mt-6">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-800 hover:text-primary-500 font-bold text-xl transition-colors py-2 border-b border-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Drawer Actions */}
          <div className="flex flex-col gap-4 mt-8">
            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-3 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 font-bold text-base transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/sell"
              onClick={() => setMenuOpen(false)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-base py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <TagIcon />
              <span>بيع سيارتك</span>
            </Link>
          </div>
        </div>
        {/* )} */}
      </header>
    </MaxWidthWrapper>
  );
}
