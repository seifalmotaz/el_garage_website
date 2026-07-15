"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TagIcon } from "../svg/Svgs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MenuButton from "./MenuButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import {
  Car as CarIcon,
  HelpCircle,
  House,
  LogOut,
  Mail,
  Newspaper,
  Sparkles,
  User as UserIcon,
  UserPlus,
} from "lucide-react";

/**
 * Compact auth / profile card pinned at the top of the mobile drawer.
 * Mirrors the Sylandr inspiration: avatar on the left, copy + CTA on
 * the right under RTL. Three states: skeleton, signed-in, signed-out.
 */
function DrawerProfileCard({ onNavigate }: { onNavigate?: () => void }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div
        aria-hidden
        className="w-full h-20 rounded-2xl bg-gray-100 animate-pulse"
      />
    );
  }

  if (isAuthenticated && user) {
    const displayName = user.firstName ?? "حسابي";
    const initial = (user.firstName?.[0] ?? "؟").toUpperCase();
    return (
      <div className="w-full bg-primary-50 border border-primary-100 rounded-2xl p-3 flex items-center gap-3">
        <Link
          href="/profile"
          onClick={onNavigate}
          aria-label="الملف الشخصي"
          className="size-11 rounded-full bg-primary-500 text-white text-base font-bold flex items-center justify-center shrink-0"
        >
          {initial}
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href="/profile"
            onClick={onNavigate}
            className="block text-gray-900 font-bold text-sm truncate"
          >
            {displayName}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            void logout();
            onNavigate?.();
          }}
          aria-label="تسجيل الخروج"
          className="size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <LogOut className="size-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-green-50 border border-green-100 rounded-2xl p-3 flex items-center gap-3">
      <div className="size-11 rounded-full bg-white border border-green-100 flex items-center justify-center shrink-0">
        <UserPlus className="size-5 text-primary-500" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 font-bold text-sm">تسجيل دخول</p>
        <p className="text-gray-500 text-xs">
          ليس لديك حساب؟{" "}
          <Link
            href="/auth/signup"
            onClick={onNavigate}
            className="text-green-600 hover:text-green-700 font-bold"
          >
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Small inline icon used to the right of each nav row in the mobile drawer. */
const navIcon: Record<string, typeof House> = {
  "/": House,
  "/cars": CarIcon,
  "/cars/featured": Sparkles,
  "/blog": Newspaper,
  "/faq": HelpCircle,
  "/contact": Mail,
};

/**
 * Auth-aware action slot rendered where the static "تسجيل الدخول" link
 * used to live. Three branches:
 *   - `isLoading === true` → skeleton
 *   - `isAuthenticated === true` → user chip + logout button
 *   - otherwise → the original "تسجيل الدخول" link
 *
 * Extracted as its own component so the desktop and mobile-drawer
 * variants stay in lockstep without duplicating branching logic.
 */
function AuthActions({
  variant,
  onNavigate,
}: {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    if (variant === "desktop") {
      return (
        <div
          aria-hidden
          className="w-20 h-8 rounded-2xl bg-white/20 animate-pulse"
        />
      );
    }
    return (
      <div
        aria-hidden
        className="w-full h-12 rounded-2xl bg-gray-200 animate-pulse"
      />
    );
  }

  if (isAuthenticated && user) {
    const displayName = user.firstName ?? "حسابي";
    const handleLogout = () => {
      void logout();
      onNavigate?.();
    };

    if (variant === "desktop") {
      return (
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            aria-label="الملف الشخصي"
            className="flex items-center gap-2 px-2 py-2 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          >
            <UserIcon className="size-6 text-white" aria-hidden />
            {/* <span className="text-white font-medium text-sm">
              {displayName}
            </span> */}
          </Link>
          {/* <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white hover:text-white/80 font-medium text-sm transition-colors duration-200 px-2 py-1.5 rounded-2xl hover:bg-white/10 cursor-pointer"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="size-4" aria-hidden />
            <span>تسجيل الخروج</span>
          </button> */}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <Link
          href="/profile"
          onClick={onNavigate}
          className="w-full py-3 px-4 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 font-bold text-base flex items-center gap-2 transition-colors"
        >
          <UserIcon className="size-5 text-primary-500" aria-hidden />
          <span>{displayName}</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-center py-3 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 font-bold text-base transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="size-5" aria-hidden />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    );
  }

  // Logged-out state — preserve the exact link/classes the Header used
  // before this phase.
  if (variant === "desktop") {
    return (
      <Link
        href="/auth/login"
        className="text-white hover:text-white/80 font-medium text-sm transition-colors duration-200"
      >
        تسجيل الدخول
      </Link>
    );
  }
  return (
    <Link
      href="/auth/login"
      onClick={onNavigate}
      className="w-full text-center py-3 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 font-bold text-base transition-colors"
    >
      تسجيل الدخول
    </Link>
  );
}

export default function Header() {
  const [activeNavlinkIdx, setActiveNavlinkIdx] = useState<number | null>(0);
  const [showHeader, setShowHeader] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const pathname = usePathname();

  const isHeaderWhite = pathname === "/";

  const navItems = [
    { label: "الصفحة الرئيسية", href: "/", idx: 0 },
    { label: "تصفح السيارات", href: "/cars", idx: 1 },
    { label: "السيارات المميزة", href: "/cars/featured", idx: 2 },
    { label: "المقالات", href: "/blog", idx: 3 },
    { label: "الأسئلة الشائعة", href: "/faq", idx: 4 },
    { label: "تواصل معنا", href: "/contact", idx: 5 },
  ];

  const carRoute = "/cars/";
  const blogRoute = "/blog/";

  useEffect(() => {
    if (!pathname.startsWith("/auth/")) {
      setShowHeader(true);
      const selectedNavItem = navItems.find((item) => item.href === pathname);
      setActiveNavlinkIdx(
        selectedNavItem
          ? selectedNavItem.idx
          : pathname.startsWith(carRoute)
            ? 1
            : pathname.startsWith(blogRoute)
              ? 3
              : null,
      );
    } else setShowHeader(false);
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const scrollHandler = () => {
      const currentScrollY = window.scrollY;

      requestAnimationFrame(() => {
        if (currentScrollY <= 200) {
          setIsHeaderVisible(true);
        }
        // Always show nav at the top of the page
        else if (currentScrollY > lastScrollY) {
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

  const [menuOpen, setMenuOpen] = useState(false);

  return !showHeader ? (
    <></>
  ) : (
    <MaxWidthWrapper className={cn("fixed z-50 w-full pt-6")}>
      <header
        style={{ pointerEvents: isHeaderVisible ? "auto" : "none" }}
        className={cn("relative", isHeaderVisible ? "" : "opacity-0")}
      >
        <div
          className={cn(
            `lg:px-8 md:px-4 px-3 rounded-2xl lg:py-4 md:py-3 py-2`,
            menuOpen
              ? isHeaderWhite
                ? "bg-white"
                : "border-none rounded-none"
              : isHeaderWhite
                ? "lg:backdrop-blur-md lg:bg-black/20 bg-white"
                : "backdrop-blur-md bg-black/20 lg:border lg:border-none",
            "flex items-center justify-between lg:shadow-lg w-full relative z-50",
          )}
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

            <Logo className="max-xl:hidden" />
            <Logo
              className="lg:hidden"
              variant={isHeaderWhite || menuOpen ? "primary" : "white"}
            />
          </Link>

          {/* Center: Navigation - Hidden on Mobile, shown on Large Screens */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-3 xl:gap-8">
            {navItems.map((item, idx) => {
              return (
                <Link
                  key={idx}
                  href={item.href}
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
            <AuthActions variant="desktop" />
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
            "lg:hidden fixed inset-0 bg-white overscroll-contain overflow-y-auto z-40 flex flex-col justify-between pt-24 px-8 pb-12 shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item, idx) => {
              const Icon = navIcon[item.href];
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 py-2 border-b border-gray-100 transition-colors text-start",
                    activeNavlinkIdx === idx
                      ? "text-primary-500"
                      : "text-gray-800 hover:text-primary-500",
                  )}
                >
                  {Icon ? (
                    <Icon className="size-5 text-gray-500" aria-hidden />
                  ) : null}
                  <span className="font-bold text-xl">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Drawer actions — unchanged from the original */}
          <div className="flex flex-col gap-4 mt-8">
            <AuthActions variant="mobile" onNavigate={() => setMenuOpen(false)} />
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
