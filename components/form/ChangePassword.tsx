"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@/components/svg/Svgs";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/shared/schemas";
import Spinner from "../common/Spinner";
import { useAuth } from "@/hooks/useAuth";

type ChangePasswordProps = {
  /**
   * E.164-formatted phone the OTP was sent to. Sent back to the
   * backend as part of `reset-password`.
   */
  phone: string;
  /**
   * The 4-digit OTP the user typed in Step 2. Sent back to the
   * backend as part of `reset-password`. Not displayed in the UI.
   */
  otpCode: string;
};

const ChangePassword = ({ phone, otpCode }: ChangePasswordProps) => {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [isPending, startTransition] = useTransition();

  // == [ Submit Action ] == //
  const onSubmit = (data: ChangePasswordSchemaType) => {
    setServerError(null);
    startTransition(async () => {
      const result = await resetPassword({
        phone,
        otpCode,
        newPassword: data.newPassword,
      });
      if (result.success) {
        // The form clears naturally via the page navigation. We pass
        // `?reset=success` so the login page can show a confirmation
        // banner for a few seconds.
        router.push("/auth/login?reset=success");
        return;
      }
      setServerError(result.error);
    });
  };
  // == [ Submit Action ] == //

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[72px]"
    >
      {/* Fields */}
      <div className="flex flex-col gap-6 w-full">
        {/* password */}
        <Input
          label="كلمة السر"
          placeholder="أدخل كلمة السر"
          type={showPassword ? "text" : "password"}
          {...register("newPassword")}
          error={errors.newPassword?.message}
          children={
            <>
              <span className="text-foreground absolute right-3 top-1/2 -translate-y-1/2">
                <KeyIcon />
              </span>
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

        {/* password confirmation */}
        <Input
          label="تأكيد كلمة السر"
          placeholder="أدخل تأكيد كلمة السر"
          type={showPasswordConfirmation ? "text" : "password"}
          {...register("newPasswordConfirmation")}
          error={errors.newPasswordConfirmation?.message}
          children={
            <>
              <span className="text-foreground absolute right-3 top-1/2 -translate-y-1/2">
                <KeyIcon />
              </span>
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation((v) => !v)}
                aria-label={
                  showPasswordConfirmation
                    ? "إخفاء كلمة المرور"
                    : "إظهار كلمة المرور"
                }
                className="text-foreground hover:text-primary-500 transition-colors cursor-pointer absolute left-3 top-1/2 -translate-y-1/2"
              >
                {showPasswordConfirmation ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </>
          }
        />
      </div>

      {/* submit button */}
      <div className="flex flex-col gap-2 w-full">
        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}
        <button
          type="submit"
          className=" text-white rounded-2xl min-h-[48px] bg-primary-500 font-semibold text-sm w-full transition-opacity hover:opacity-90 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "حفظ"}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;