"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CallIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from "@/components/svg/Svgs";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/shared/schemas";
import { useAuth } from "@/hooks/useAuth";
import LeftSideHero from "@/components/form/LeftSideHero";
import Logo from "@/components/form/Logo";
import Spinner from "@/components/common/Spinner";

/** Auto-hide duration for the "password reset" success banner, in ms. */
const RESET_BANNER_AUTO_HIDE_MS = 5000;

/**
 * Inner client component that reads `?reset=success` from the URL.
 *
 * Kept separate from the page wrapper so `useSearchParams` is reached
 * inside the surrounding `<Suspense>` boundary (Next.js 16 requirement
 * for static / prerendered client routes — same pattern as
 * `app/auth/verify-otp/page.tsx`).
 */
function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showVerifyLink, setShowVerifyLink] = useState(false);
  // Captured from the last submit so the verify-otp link can use it.
  const [lastPhoneE164, setLastPhoneE164] = useState<string | null>(null);

  // Banner: show only when the URL carries `?reset=success`. Once
  // dismissed (manually or after the 5s timer) we keep it hidden for
  // the lifetime of this mount — re-mounting the page (e.g. via a
  // fresh navigation) is what re-evaluates the URL flag.
  const [showResetBanner, setShowResetBanner] = useState<boolean>(
    () => searchParams.get("reset") === "success",
  );

  useEffect(() => {
    if (!showResetBanner) return;
    const id = setTimeout(
      () => setShowResetBanner(false),
      RESET_BANNER_AUTO_HIDE_MS,
    );
    return () => clearTimeout(id);
  }, [showResetBanner]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const [isPending, startTransition] = useTransition();

  // == [ Submit Action ] == //
  const onSubmit = (data: LoginSchemaType) => {
    setServerError(null);
    setShowVerifyLink(false);
    // Compose E.164 before awaiting so we can use the same value in the
    // verify-otp link if the backend tells us the phone isn't verified.
    const phoneE164 = `+20${data.phoneNumber}`;
    setLastPhoneE164(phoneE164);
    startTransition(async () => {
      const result = await login({
        phone: phoneE164,
        password: data.password,
      });
      if (result.success) {
        // Honour returnUrl from offer/sell/profile gates; only allow
        // same-origin relative paths (block open redirects).
        const returnUrl = searchParams.get("returnUrl");
        const safeReturn =
          returnUrl &&
          returnUrl.startsWith("/") &&
          !returnUrl.startsWith("//")
            ? returnUrl
            : "/";
        router.push(safeReturn);
        return;
      }
      setServerError(result.error);
      if (result.error.toLowerCase().includes("not verified")) {
        setShowVerifyLink(true);
      }
    });
  };
  // == [ Submit Action ] == //

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-foreground text-center">
        تسجيل <span className="text-primary-500">الدخول</span>
      </h2>

      {/* Success banner after password reset. */}
      {showResetBanner && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm"
        >
          <span className="flex-1 text-center font-medium">
            تم تغيير كلمة المرور بنجاح
          </span>
          <button
            type="button"
            onClick={() => setShowResetBanner(false)}
            aria-label="إغلاق الرسالة"
            className="shrink-0 leading-none text-green-700 hover:text-green-900 transition-colors cursor-pointer text-lg"
          >
            ×
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[72px]"
      >
        {/* Fields */}
        <div className="flex flex-col gap-6 w-full">
          {/* phone */}
          <Input
            label="رقم الجوال"
            placeholder="14444444"
            type="tel"
            dir="ltr"
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message}
            children={
              <>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-sm">
                  +20
                </span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground">
                  <CallIcon />
                </span>
              </>
            }
          />

          {/* password */}
          <Input
            label="كلمة السر"
            type={showPassword ? "text" : "password"}
            placeholder="أدخل كلمة السر"
            {...register("password")}
            error={errors.password?.message}
            children={
              <>
                <span className="text-foreground absolute right-3 top-1/2 -translate-y-1/2">
                  <KeyIcon />
                </span>
                <Link
                  href={"/auth/forget-password"}
                  className="text-black absolute left-0 text-[12px] cursor-pointer translate-y-4.5 bottom-0 hover:underline underline-offset-2 z-10"
                >
                  نسيت كلمة المرور؟
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  className="text-foreground hover:text-primary-500 transition-colors cursor-pointer absolute left-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                </button>
              </>
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full">
          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}
          {showVerifyLink && lastPhoneE164 && (
            <Link
              href={`/auth/verify-otp?phone=${encodeURIComponent(
                lastPhoneE164,
              )}`}
              className="text-primary-500 underline text-sm text-center"
            >
              تحقق من رقمك أولاً
            </Link>
          )}
          <button
            type="submit"
            className="bg-foreground text-white rounded-2xl min-h-[48px] font-semibold text-sm w-full transition-opacity hover:opacity-90 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "تسجيل الدخول"}
          </button>
          <Link
            href="/auth/signup"
            className="text-foreground min-h-[48px] font-semibold text-sm w-full flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            انشاء الحساب
          </Link>
          <Link
            href="/"
            className="min-h-[48px] flex items-center justify-center text-sm text-foreground underline underline-offset-4 hover:text-primary-500 transition-colors"
          >
            تصفح الموقع ك ضيف
          </Link>
        </div>
      </form>
    </div>
  );
}

/**
 * Page wrapper. The actual logic lives in `LoginPageInner` so the
 * `useSearchParams()` call is reached inside a `<Suspense>` boundary,
 * matching the verify-otp pattern required by Next.js 16 for client
 * components that may be prerendered.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-12 bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-[376px] flex flex-col gap-[52px]">
          {/* Logo */}
          <Logo />

          {/* Form Section */}
          <Suspense fallback={null}>
            <LoginPageInner />
          </Suspense>
        </div>
      </div>

      <LeftSideHero />
    </div>
  );
}