"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, TagIcon } from "../svg/Svgs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MenuButton from "./MenuButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Header({ activeHref }: { activeHref?: string }) {
  const [activeNavlinkIdx, setActiveNavlinkIdx] = useState<number>(0);
  const [showHeader, setShowHeader] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const pathname = usePathname();

  const navItems = [
    { label: "الصفحة الرئيسية", href: "/", idx: 0 },
    { label: "تصفح السيارات", href: "/cars", idx: 1 },
    { label: "السيارات المميزة", href: "/cars/featured", idx: 2 },
    { label: "المقالات", href: "/blog", idx: 3 },
    { label: "الأسئلة الشائعة", href: "/faq", idx: 4 },
    { label: "تواصل معنا", href: "/contact", idx: 5 },
  ];

  useEffect(() => {
    if (!pathname.startsWith("/auth/")) {
      setShowHeader(true);
      setActiveNavlinkIdx(
        navItems.find((item) => item.href === pathname)?.idx || 0,
      );
    } else setShowHeader(false);
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const scrollHandler = () => {
      const currentScrollY = window.scrollY;

      requestAnimationFrame(() => {
        // Always show nav at the top of the page
        if (currentScrollY > lastScrollY) {
          // scrolling down
          setIsHeaderVisible(false);
        } else {
          // scrolling up
          setIsHeaderVisible(true);
        }

        lastScrollY = currentScrollY;
      });
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  useEffect(() => {
    if (window.scrollY < 100) setIsHeaderVisible(true);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return !showHeader ? (
    <></>
  ) : (
    <MaxWidthWrapper className={cn("fixed z-50 w-full pt-6")}>
      <header
        style={{ pointerEvents: isHeaderVisible ? "auto" : "none" }}
        className={cn(
          "relative duration-300 transition-opacity ",
          isHeaderVisible ? "" : "opacity-0",
        )}
      >
        <div
          className={`lg:px-8 md:px-4 px-3 rounded-2xl lg:py-4 md:py-3 py-2
        ${
          menuOpen
            ? "border-none rounded-none"
            : "backdrop-blur-md bg-black/20 lg:border lg:border-none  "
        }
        flex items-center justify-between lg:shadow-lg w-full relative z-50
      `}
        >
          {/* Right: Logo (Placed first to align rightmost under RTL flow) */}
          <Link href="/" className="flex items-center gap-3 z-50">
            <div className="relative w-8 h-8 xl:hidden max-lg:hidden">
              <Image
                src="/logo-part.svg"
                alt="elGARAGE Logo"
                fill
                className=""
              />
            </div>
            <Logo className="lg:hidden xl:flex" />
          </Link>

          {/* Center: Navigation - Hidden on Mobile, shown on Large Screens */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-3 xl:gap-8">
            {navItems.map((item, idx) => {
              return (
                <Link
                  key={idx}
                  href={item.href}
                  // onClick={() => setActiveNavlinkIdx(idx)}
                  className={`text-white hover:text-white/80 text-sm lg:text-[12px] 2xl:text-sm font-medium transition-colors duration-200 ${
                    activeNavlinkIdx === idx
                      ? "font-bold border-b-2 border-white pb-1"
                      : ""
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
              href="/auth/login"
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
            className="lg:hidden size-11.5 bg-primary-500 hover:bg-primary-600 rounded-[14.7px] flex items-center justify-center cursor-pointer transition-colors shadow-md z-50"
          >
            <MenuButton open={menuOpen} setOpen={setMenuOpen} />
          </button>
        </div>

        {/* Mobile Drawer Menu Overlay */}
        {/* {menuOpen && ( */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 bg-white overscroll-contain overflow-y-auto z-40 flex flex-col justify-between pt-24 px-8 pb-12 shadow-2xl duration-300",
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
              href="/auth/login"
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
