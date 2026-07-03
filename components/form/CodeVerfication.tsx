import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn, fakePromise } from "@/lib/utils";
import { verifyCodeSchema, VerifyCodeSchemaType } from "@/shared/schemas";

const time = 30; // in seconds

const CodeVerification = () => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(time);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<VerifyCodeSchemaType>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });

  const [isPending, startTransition] = useTransition();

  const code = watch("code");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // focus first
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // timer
  useEffect(() => {
    if (timer === 0) return;
    intervalRef.current = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(intervalRef?.current || 0);
  }, [timer]);

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

  const handleResend = () => setTimer(time);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onSubmit = (data: VerifyCodeSchemaType) => {
    // console.log(data.code);
    startTransition(async () => {
      stopTimer();
      await fakePromise();
      reset(); // clear all input
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground text-center">
          كود <span className="text-primary-500">التحقق</span>
        </h2>

        <p className="text-neutral-600 text-center py-[32px]">
          من فضلك أدخل الرمز الذي تم إرساله إلى ******45
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

      {/* Timer */}
      <div className="text-center text-sm space-y-3 mb-8">
        <p>
          لم يتم إرسال الكود؟{" "}
          <button
            className="text-primary-500 font-medium cursor-pointer"
            onClick={handleResend}
          >
            إعادة الإرسال
          </button>
        </p>
        <span>00:{timer}</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={code.length !== 4 || isPending}
        className={cn(
          "w-full py-3 rounded-2xl font-bold transition-opacity disabled:hover:opacity-100 disabled:cursor-auto hover:opacity-90 cursor-pointer",
          code.length !== 4
            ? "text-[#666] bg-[#F2F2F2]"
            : "bg-blue-500 text-white",
        )}
      >
        {isPending ? <span className="spinner" /> : "إرسال"}
      </button>
    </form>
  );
};

export default CodeVerification;
