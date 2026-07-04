"use client";

import { useTransition } from "react";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgetPasswordSchema,
  ForgetPasswordSchemaType,
} from "@/shared/schemas";
import { fakePromise } from "@/lib/utils";
import Spinner from "../common/Spinner";

const PhoneOrEmail = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgetPasswordSchemaType>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const [isPending, startTransition] = useTransition();

  // == [ Submit Action ] == //
  const onSubmit = (data: ForgetPasswordSchemaType) => {
    // console.log(data);
    startTransition(async () => {
      await fakePromise();
      reset(); // clear all input
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
            type="text"
            {...register("phoneNumberOrEmail")}
            error={errors.phoneNumberOrEmail?.message}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full">
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
