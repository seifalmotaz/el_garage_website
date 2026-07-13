"use client";

import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LeftSideHero from "@/components/form/LeftSideHero";
import Logo from "@/components/form/Logo";
import { VerficationCodeSvg } from "@/components/svg/Svgs";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/common/Spinner";

/** Length of the OTP code, in digits. Mirrors the backend DTO. */
const OTP_LENGTH = 4;
/** Resend cooldown, in seconds. */
const RESEND_SECONDS = 30;

/**
 * Inner client component that reads `?phone=…` from the URL.
 *
 * Kept separate from the page wrapper so `useSearchParams` is reached
 * inside the surrounding `<Suspense>` boundary (Next.js 16 requirement
 * for static / prerendered client routes).
 */
function VerifyOtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();

  const phone = searchParams.get("phone");

  // Refs for the 4 digit inputs.
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [codeDigits, setCodeDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(RESEND_SECONDS);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Focus the first input on mount.
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Resend cooldown timer.
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // Fallback when no phone is present in the URL.
  if (!phone) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <VerficationCodeSvg />
        <h2 className="text-2xl font-bold text-foreground">
          رابط <span className="text-primary-500">غير صالح</span>
        </h2>
        <p className="text-neutral-600">
          لم يتم العثور على رقم الجوال في الرابط. يرجى إعادة المحاولة من صفحة
          إنشاء الحساب.
        </p>
        <Link
          href="/auth/signup"
          className="bg-foreground text-white rounded-2xl min-h-[48px] font-semibold text-sm w-full flex items-center justify-center transition-opacity hover:opacity-90"
        >
          العودة إلى إنشاء الحساب
        </Link>
      </div>
    );
  }

  const code = codeDigits.join("");
  const canSubmit = code.length === OTP_LENGTH && !isPending;

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    setServerError(null);
    setResendMessage(null);
    const next = [...codeDigits];
    next[index] = value;
    setCodeDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (codeDigits[index]) {
        const next = [...codeDigits];
        next[index] = "";
        setCodeDigits(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length && i < OTP_LENGTH; i++) {
      next[i] = pasted[i];
    }
    setCodeDigits(next);
    setServerError(null);
    setResendMessage(null);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setServerError(null);
    startTransition(async () => {
      const result = await verifyOtp({ phone: phone!, otpCode: code });
      if (result.success) {
        setVerified(true);
        return;
      }
      setServerError(result.error);
    });
  };

  const handleResend = () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setResendMessage(null);
    setServerError(null);
    void (async () => {
      try {
        const result = await resendOtp({ phone: phone! });
        if (result.success) {
          setResendMessage("تم إعادة إرسال الكود");
          setResendTimer(RESEND_SECONDS);
        } else {
          setServerError(result.error);
        }
      } finally {
        setIsResending(false);
      }
    })();
  };

  // ===== Success state ===== //
  if (verified) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <VerficationCodeSvg />
        <h2 className="text-2xl font-bold text-foreground">
          تم التحقق <span className="text-primary-500">بنجاح</span>
        </h2>
        <p className="text-neutral-600 max-w-[320px]">
          تم تفعيل رقم جوالك بنجاح. يمكنك الآن تسجيل الدخول.
        </p>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="bg-foreground text-white rounded-2xl min-h-[48px] font-semibold text-sm w-full flex items-center justify-center transition-opacity hover:opacity-90 cursor-pointer"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  // ===== Default state (form) ===== //
  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground text-center">
          كود <span className="text-primary-500">التحقق</span>
        </h2>

        <p className="text-neutral-600 text-center py-[32px]">
          من فضلك أدخل الرمز المرسل إلى رقمك{" "}
          <span className="font-medium text-foreground" dir="ltr">
            {phone}
          </span>
        </p>
      </div>

      {/* Error above the inputs */}
      {serverError && (
        <p className="text-red-500 text-center text-[13px] mb-4">
          {serverError}
        </p>
      )}

      {/* Inputs */}
      <div className="flex gap-5 justify-center relative mb-4" dir="ltr">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <div key={i} className="relative">
            <input
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={codeDigits[i] || ""}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              aria-label={`الرقم ${i + 1}`}
              className="sm:size-[62px] size-[48px] text-center text-xl border rounded-2xl focus:outline-none border-[#ddd] focus:border-blue-500 caret-transparent"
            />

            {/* ➖ Dash placeholder */}
            {!codeDigits[i] && (
              <span className="absolute inset-0 flex items-center justify-center text-[#B3B3B3] text-xl pointer-events-none">
                —
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Timer / resend */}
      <div className="text-center text-sm space-y-3 mb-8">
        {resendMessage && (
          <p className="text-primary-500">{resendMessage}</p>
        )}
        <p>
          لم يصل الكود؟{" "}
          <button
            type="button"
            disabled={resendTimer > 0 || isResending}
            onClick={handleResend}
            className="text-primary-500 font-medium cursor-pointer disabled:text-neutral-400 disabled:cursor-not-allowed"
          >
            إعادة الإرسال
          </button>
        </p>
        {resendTimer > 0 && <span>00:{String(resendTimer).padStart(2, "0")}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-3 rounded-2xl font-bold transition-opacity disabled:hover:opacity-100 disabled:cursor-auto hover:opacity-90 cursor-pointer bg-foreground text-white disabled:bg-[#F2F2F2] disabled:text-[#666]"
      >
        {isPending ? <Spinner /> : "إرسال"}
      </button>

      {/* Edit phone link */}
      <Link
        href="/auth/signup"
        className="text-center text-sm text-foreground underline underline-offset-4 hover:text-primary-500 transition-colors mt-6"
      >
        تعديل رقم الجوال
      </Link>
    </form>
  );
}

/**
 * Page wrapper. The actual logic lives in `VerifyOtpInner` so the
 * `useSearchParams()` call is reached inside a `<Suspense>` boundary,
 * as required by Next.js 16 for client components that may be
 * prerendered.
 */
export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-12 bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-[376px] flex flex-col">
          <div className="flex flex-col items-center gap-[52px] mb-[52px]">
            <Logo />
            <VerficationCodeSvg />
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            }
          >
            <VerifyOtpInner />
          </Suspense>
        </div>
      </div>

      <LeftSideHero />
    </div>
  );
}
