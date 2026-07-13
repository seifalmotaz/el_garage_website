"use client";

import { useState, useTransition } from "react";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgetPasswordSchema,
  ForgetPasswordSchemaType,
} from "@/shared/schemas";
import Spinner from "../common/Spinner";
import { useAuth } from "@/hooks/useAuth";

/** Local 10-digit phone matcher — same regex as `phoneNumberSchema`. */
const LOCAL_PHONE_REGEX = /^[1-9]\d{9}$/;

type PhoneOrEmailProps = {
  /**
   * Called when the backend confirms the OTP was dispatched.
   * The handler receives the E.164-formatted phone (e.g. `+201001234567`)
   * so the parent state machine can pass it forward to Step 2.
   */
  onSuccess: (phoneE164: string) => void;
};

const PhoneOrEmail = ({ onSuccess }: PhoneOrEmailProps) => {
  const { forgotPassword } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordSchemaType>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const [isPending, startTransition] = useTransition();

  // == [ Submit Action ] == //
  const onSubmit = (data: ForgetPasswordSchemaType) => {
    setServerError(null);

    // The zod schema accepts email OR phone; the backend only accepts
    // a 10-digit local phone for password reset, so we re-validate
    // locally and reject emails with a clear message.
    if (!LOCAL_PHONE_REGEX.test(data.phoneNumberOrEmail)) {
      setServerError("يرجى إدخال رقم جوال صحيح مكون من 10 أرقام");
      return;
    }

    // Compose E.164 (Egypt) right before the API call, matching the
    // pattern used by login/signup.
    const phoneE164 = `+20${data.phoneNumberOrEmail}`;

    startTransition(async () => {
      const result = await forgotPassword({ phone: phoneE164 });
      if (result.success) {
        onSuccess(phoneE164);
        return;
      }
      setServerError(result.error);
    });
  };
  // == [ Submit Action ] == //

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-foreground text-center">
        نسيت <span className="text-primary-500">كلمة المرور</span> ؟
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[72px]"
      >
        {/* Fields */}
        <div className="flex flex-col gap-6 w-full">
          {/* phone */}
          <Input
            label="رقم الجوال أو البريد الالكتروني"
            placeholder="أدخل رقم الجوال أو البريد الالكتروني"
            type="tel"
            dir="ltr"
            {...register("phoneNumberOrEmail")}
            error={errors.phoneNumberOrEmail?.message}
            children={
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-sm">
                +20
              </span>
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full">
          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}
          <button
            type="submit"
            className="bg-primary-500 text-white rounded-2xl min-h-[48px] font-semibold text-sm w-full transition-opacity hover:opacity-90 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "تحقق"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhoneOrEmail;