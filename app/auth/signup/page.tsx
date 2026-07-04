"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CallIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  MailIcon,
  UserIcon,
} from "@/components/svg/Svgs";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchemaType } from "@/shared/schemas";
import { fakePromise } from "@/lib/utils";
import LeftSideHero from "@/components/form/LeftSideHero";
import Logo from "@/components/form/Logo";
import Spinner from "@/components/common/Spinner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
  });

  const [isPending, startTransition] = useTransition();

  // == [ Submit Action ] == //
  const onSubmit = (data: SignupSchemaType) => {
    // console.log(data);
    startTransition(async () => {
      await fakePromise();
      reset(); // clear all input
    });
  };
  // == [ Submit Action ] == //

  return (
    <div className="flex min-h-screen bg-white">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-12 bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-[376px] flex flex-col gap-[52px]">
          {/* Logo */}
          <Logo />

          {/* Form Section */}
          <div className="flex flex-col gap-8">
            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground text-center">
              انشاء <span className="text-primary-500">الحساب</span>
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[72px]"
            >
              {/* Fields */}
              <div className="flex flex-col gap-6 w-full">
                {/* full name */}
                <Input
                  label="الأسم بالكامل"
                  placeholder="أدخل اسمك"
                  type="text"
                  {...register("fullName")}
                  error={errors.fullName?.message}
                  children={
                    <>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground">
                        <UserIcon />
                      </span>
                    </>
                  }
                />

                {/* email */}
                <Input
                  label="البريد الالكتروني"
                  placeholder="أدخل البريد الالكتروني"
                  type="text"
                  {...register("email")}
                  error={errors.email?.message}
                  children={
                    <>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground">
                        <MailIcon />
                      </span>
                    </>
                  }
                />

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
                        +966
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
                  placeholder="أدخل كلمة السر"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={errors.password?.message}
                  children={
                    <>
                      <span className="text-foreground absolute right-3 top-1/2 -translate-y-1/2">
                        <KeyIcon />
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword
                            ? "إخفاء كلمة المرور"
                            : "إظهار كلمة المرور"
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
                  {...register("passwordConfirmation")}
                  error={errors.passwordConfirmation?.message}
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
                        {showPasswordConfirmation ? (
                          <EyeIcon />
                        ) : (
                          <EyeSlashIcon />
                        )}
                      </button>
                    </>
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 w-full">
                <button
                  type="submit"
                  className="bg-foreground text-white rounded-2xl min-h-[48px] font-semibold text-sm w-full transition-opacity hover:opacity-90 cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : "انشاء الحساب"}
                </button>
                <Link
                  href="/auth/login"
                  className="text-foreground min-h-[48px] font-semibold text-sm w-full flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  تسجيل الدخول
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
        </div>
      </div>

      <LeftSideHero
        text={{
          line1: "أنشئ حسابك في ثواني وبدء",
          line2: "البحث عن سيارتك المثالية",
        }}
        bottomSubText={{
          line1: "نشئ حسابك مجانًا واستلم إشعارات السيارات الفاخرة،",
          line2: "تقارير فحص فورية، وعروض خاصة يومية حصرية",
        }}
      />
    </div>
  );
}
