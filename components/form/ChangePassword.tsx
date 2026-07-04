"use client";

import { useState, useTransition } from "react";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@/components/svg/Svgs";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/shared/schemas";
import { fakePromise } from "@/lib/utils";
import Spinner from "../common/Spinner";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [isPending, startTransition] = useTransition();

  // == [ Submit Action ] == //
  const onSubmit = (data: ChangePasswordSchemaType) => {
    // console.log(data);
    startTransition(async () => {
      await fakePromise();
      reset(); // clear all input
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
      <button
        type="submit"
        className=" text-white rounded-2xl min-h-[48px] bg-primary-500 font-semibold text-sm w-full transition-opacity hover:opacity-90 cursor-pointer"
        disabled={isPending}
      >
        {isPending ? <Spinner /> : "حفظ"}
      </button>
    </form>
  );
};

export default ChangePassword;
