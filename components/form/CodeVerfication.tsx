"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { verifyCodeSchema, VerifyCodeSchemaType } from "@/shared/schemas";

type CodeVerificationProps = {
  /**
   * E.164-formatted phone the OTP was sent to. Used only to render a
   * masked hint like `***4567` — the code itself is consumed by the
   * parent state machine in the next step.
   */
  phone: string;
  /**
   * Called when the user submits a 4-digit code. The handler receives
   * the raw 4-digit string. The parent advances to Step 3 (new password)
   * on this callback. No API call is made here — the backend consumes
   * the OTP only via the final `reset-password` endpoint.
   */
  onSuccess: (otpCode: string) => void;
};

const CodeVerification = ({ phone, onSuccess }: CodeVerificationProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyCodeSchemaType>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });

  const code = watch("code");

  // focus first
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const arr = code.split("");
    arr[index] = value;
    const newCode = arr.join("").padEnd(4, "");

    setValue("code", newCode);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const arr = code.split("");
        arr[index] = "";
        setValue("code", arr.join(""));
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pasted)) return;

    setValue("code", pasted);
    inputsRef.current[Math.min(pasted.length, 3)]?.focus();
  };

  // Step 2 of the forget-password flow is purely local: we surface the
  // typed code to the parent and let it advance to Step 3. The backend
  // does not expose a separate "verify the OTP only" endpoint for
  // password reset — the code is consumed by `reset-password` later.
  const onSubmit = (data: VerifyCodeSchemaType) => {
    onSuccess(data.code);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground text-center">
          كود <span className="text-primary-500">التحقق</span>
        </h2>

        <p className="text-neutral-600 text-center py-[32px]">
          من فضلك أدخل الرمز الذي تم إرساله إلى ***{phone.slice(-4)}
        </p>
      </div>

      {/* Inputs */}
      <div className="flex gap-5 justify-center relative mb-4" dir="ltr">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative">
            <input
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={code[i] || ""}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              className="sm:size-[62px] size-[48px] text-center text-xl border rounded-2xl focus:outline-none border-[#ddd] focus:border-blue-500 caret-transparent"
            />

            {/* ➖ Dash placeholder */}
            {!code[i] && (
              <span className="absolute inset-0 flex items-center justify-center text-[#B3B3B3] text-xl pointer-events-none">
                —
              </span>
            )}
          </div>
        ))}

        {/* Error */}
        {/* {errors.code && (
          <p className="text-red-500 text-center text-[13px] absolute bottom-0 translate-y-6">
            {errors.code.message}
          </p>
        )} */}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={code.length !== 4}
        className={cn(
          "w-full py-3 rounded-2xl font-bold transition-opacity disabled:hover:opacity-100 disabled:cursor-auto hover:opacity-90 cursor-pointer",
          code.length !== 4
            ? "text-[#666] bg-[#F2F2F2]"
            : "bg-blue-500 text-white",
        )}
      >
        متابعة
      </button>
    </form>
  );
};

export default CodeVerification;