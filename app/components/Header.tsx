"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header({ activeHref, variant = "light" }: { activeHref?: string; variant?: "light" | "dark" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "الصفحة الرئيسية", href: "/" },
    { label: "تصفح السيارات", href: "/cars" },
    { label: "السيارات المميزة", href: "/#grid-featured" },
    { label: "المقالات", href: "/blog" },
    { label: "الأسئلة الشائعة", href: "/#faq" },
    { label: "تواصل معنا", href: "/#footer" },
  ];

  return (
    <header className={`
      absolute z-50 max-w-[1336px]
      ${variant === "dark" 
        ? "top-12 left-5 right-5 w-[calc(100%-40px)] lg:top-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:w-[calc(100%-2rem)]" 
        : "top-0 lg:top-6 left-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[calc(100%-2rem)]"
      }
    `}>
      <div className={`
        ${variant === "dark" 
          ? (menuOpen 
              ? "bg-transparent border-none rounded-[20px] lg:rounded-2xl px-3.5 lg:px-6 py-2 lg:py-4 h-[60px] lg:h-auto"
              : "backdrop-blur-md bg-[#000000]/30 border border-white/10 rounded-[20px] lg:rounded-2xl px-3.5 lg:px-6 py-2 lg:py-4 h-[60px] lg:h-auto"
            )
          : (menuOpen
              ? "bg-transparent border-none rounded-none lg:rounded-2xl px-6 py-4"
              : "bg-white lg:backdrop-blur-md lg:bg-black/20 lg:border lg:border-white/10 border-b border-gray-100 lg:border-none rounded-none lg:rounded-2xl px-6 py-4"
            )
        }
        flex items-center justify-between lg:shadow-lg w-full relative z-50
      `}>
        
        {/* Right: Logo (Placed first to align rightmost under RTL flow) */}
        <Link href="/" className="flex items-center gap-3 z-50">
          {/* Mobile Logo Shield & Text */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src={(variant === "dark" && !menuOpen) ? "/assets/logo_shield.svg" : "/assets/logo_shield_color.svg"}
                alt="elGARAGE Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-[117px] h-[16px]">
              <Image
                src={(variant === "dark" && !menuOpen) ? "/assets/logo_text.svg" : "/assets/logo_text_dark.svg"}
                alt="elGARAGE"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Desktop Logo Shield & Text */}
          <div className="hidden lg:flex items-center gap-3">
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
          </div>
        </Link>

        {/* Center: Navigation - Hidden on Mobile, shown on Large Screens */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item, idx) => {
            const isActive = activeHref
              ? item.href === activeHref || (item.href === "/" && activeHref === "/")
              : idx === 0;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`text-white hover:text-white/80 text-sm font-medium transition-colors duration-200 ${
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
            <Image
              src="/assets/search_normal.svg"
              alt="search"
              width={20}
              height={20}
              className="w-5 h-5 invert"
            />
          </button>
          <Link
            href="#"
            className="text-white hover:text-white/80 font-medium text-sm transition-colors duration-200"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/sell"
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 transition-colors duration-200"
          >
            <span>بيع سيارتك</span>
            <Image
              src="/assets/tag_icon.svg"
              alt="tag"
              width={20}
              height={20}
              className="w-5 h-5 invert"
            />
          </Link>
        </div>

        {/* Hamburger Menu Icon (Shown on Mobile on Left side of flow - placed last to render leftmost under RTL flow) */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-11 h-11 bg-primary-500 hover:bg-primary-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-md z-50"
        >
          {menuOpen ? (
            <svg className="w-6 h-6 stroke-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 stroke-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col justify-between pt-24 px-8 pb-12 shadow-2xl animate-fade-in">
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
              <span>بيع سيارتك</span>
              <Image
                src="/assets/tag_icon.svg"
                alt="tag"
                width={20}
                height={20}
                className="w-5 h-5 invert"
              />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
