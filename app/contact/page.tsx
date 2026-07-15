"use client";
import Button from "@/components/common/Button";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import PageBanner from "@/components/common/PageBanner";
import Input from "@/components/form/Input";
import Logo from "@/components/form/Logo";
import Select from "@/components/form/Select";
import Textarea from "@/components/form/Textarea";
import {
  CallIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  TiwtterIcon,
  UserIcon,
  YoutubeIcon,
} from "@/components/svg/Svgs";
import { submitContact, type ContactMessageType } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/errors";
import { contactSchema, ContactSchemaType } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3337 4.66683V11.3335C13.3337 14.0002 12.667 14.6668 10.0003 14.6668H6.00033C3.33366 14.6668 2.66699 14.0002 2.66699 11.3335V4.66683C2.66699 2.00016 3.33366 1.3335 6.00033 1.3335H10.0003C12.667 1.3335 13.3337 2.00016 13.3337 4.66683Z"
      stroke="#141414"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.33366 3.66699H6.66699"
      stroke="#141414"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00013 12.7337C8.57082 12.7337 9.03346 12.271 9.03346 11.7003C9.03346 11.1296 8.57082 10.667 8.00013 10.667C7.42944 10.667 6.9668 11.1296 6.9668 11.7003C6.9668 12.271 7.42944 12.7337 8.00013 12.7337Z"
      stroke="#141414"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.333 13.6668H4.66634C2.66634 13.6668 1.33301 12.6668 1.33301 10.3335V5.66683C1.33301 3.3335 2.66634 2.3335 4.66634 2.3335H11.333C13.333 2.3335 14.6663 3.3335 14.6663 5.66683V10.3335C14.6663 12.6668 13.333 13.6668 11.333 13.6668Z"
      stroke="#141414"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.3337 6L9.24699 7.66667C8.56032 8.21333 7.43366 8.21333 6.74699 7.66667L4.66699 6"
      stroke="#141414"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.99992 8.95346C9.14867 8.95346 10.0799 8.02221 10.0799 6.87346C10.0799 5.7247 9.14867 4.79346 7.99992 4.79346C6.85117 4.79346 5.91992 5.7247 5.91992 6.87346C5.91992 8.02221 6.85117 8.95346 7.99992 8.95346Z"
      stroke="#141414"
    />
    <path
      d="M2.41379 5.66016C3.72712 -0.113169 12.2805 -0.106502 13.5871 5.66683C14.3538 9.0535 12.2471 11.9202 10.4005 13.6935C9.06046 14.9868 6.94046 14.9868 5.59379 13.6935C3.75379 11.9202 1.64712 9.04683 2.41379 5.66016Z"
      stroke="#141414"
    />
  </svg>
);

const page = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
  });

  const messageTypeWatch = watch("messageType");

  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<
    { type: "success"; message: string } | { type: "error"; message: string } | null
  >(null);

  // == [ Submit Action ] == //
  const onSubmit = (data: ContactSchemaType) => {
    setSubmitStatus(null);
    // The form collects a 10-digit local phone number; the backend
    // expects E.164, so prepend the Egyptian country code before sending.
    const phoneWithCountryCode = `+20${data.phoneNumber}`;
    const { phoneNumber: _phoneNumber, ...rest } = data;
    void _phoneNumber;
    startTransition(async () => {
      try {
        const res = await submitContact({
          ...rest,
          phone: phoneWithCountryCode,
          // The form schema types `messageType` as `string`, but the
          // backend enum only accepts one of these three values. The
          // <Select> only emits the matching Arabic→enum pair, so we
          // narrow here at the API boundary.
          messageType: rest.messageType as ContactMessageType,
        });
        setSubmitStatus({ type: "success", message: res.message });
        reset(); // clear all input
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "حدث خطأ غير متوقع، حاول مرة أخرى";
        setSubmitStatus({ type: "error", message });
      }
    });
  };
  // == [ Submit Action ] == //

  return (
    <main>
      <PageBanner title="تواصل معنا" href="/contact" />

      <section className="py-[52px]">
        <MaxWidthWrapper>
          <div className="lg:p-[52px] lg:bg-gray-100 rounded-[32px] flex max-lg:flex-col-reverse gap-6">
            <div className="flex-1 flex flex-col justify-between gap-[52px]  max-lg:bg-gray-100  max-lg:rounded-[32px]  max-lg:p-[20px]">
              <div className="space-y-[52px]">
                <div className="space-y-6 max-w-[570px]">
                  <h2 className="text-[32px] font-medium text-[#0C295A]">
                    تواصل معنا
                  </h2>

                  <p className="text-[16px] text-[#1F2937]">
                    فريقنا من المفتشين والمتخصصين جاهز يرد عليك في أقرب وقت.
                    سواء عندك سؤال عن خدماتنا، عاوز تحجز موعد فحص، أو محتاج
                    مساعدة — مكانك هنا
                  </p>

                  <p className="text-[16px] text-[#1F2937]">
                    فريقنا من المفتشين والمتخصصين جاهز يرد عليك في أقرب وقت.
                    سواء عندك سؤال عن خدماتنا، عاوز تحجز موعد فحص، أو محتاج
                    مساعدة — مكانك هنا
                  </p>
                </div>

                <div className="space-y-[25px]">
                  <div className="flex items-center gap-2">
                    <div className="size-8 border border-[#1A1A1A] rounded-full flex justify-center items-center">
                      <PhoneIcon />
                    </div>
                    <span className="text-[20px]">19900</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-8 border border-[#1A1A1A] rounded-full flex justify-center items-center">
                      <InfoIcon />
                    </div>
                    <span className="text-[20px]">info@elgarage.eg</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="size-8 border border-[#1A1A1A] rounded-full flex justify-center items-center">
                      <LocationIcon />
                    </div>
                    <span className="text-[20px]">
                      القاهرة، مصر الجديدة، شارع الثورة
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-row-reverse justify-end gap-4">
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-[#1A1A1A] flex items-center justify-center transition-colors"
                >
                  <YoutubeIcon color="#1A1A1A" />
                </Link>
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-[#1A1A1A] flex items-center justify-center transition-colors"
                >
                  <FacebookIcon color="#1A1A1A" />
                </Link>
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-[#1A1A1A] flex items-center justify-center transition-colors"
                >
                  <TiwtterIcon color="#1A1A1A" />
                </Link>
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-[#1A1A1A] flex items-center justify-center transition-colors"
                >
                  <InstagramIcon color="#1A1A1A" />
                </Link>
              </div>
            </div>
            <div className="border border-gray-200 rounded-[32px] lg:p-[32px] py-[32px] px-[16px] bg-white lg:w-[574px]">
              {/* Logo */}
              <div className="mx-auto w-fit mb-[32px]">
                <Logo />
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-[72px]"
              >
                {/* Submit status banner */}
                {submitStatus && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`text-sm rounded-xl px-4 py-3 border ${
                      submitStatus.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {/* Fields */}
                <div className="flex flex-col gap-8 w-full">
                  {/* full name */}
                  <Input
                    label="الأسم"
                    variant="white"
                    placeholder="أدخل اسمك"
                    type="text"
                    {...register("name")}
                    error={errors.name?.message}
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
                    variant="white"
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
                    variant="white"
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

                  {/* message type */}
                  <Select
                    placeholder="حدد نوع الرسالة"
                    label="نوع الرسالة"
                    options={[
                      { label: "اقتراح", value: "suggestion" },
                      { label: "شكوى", value: "complaint" },
                      { label: "استفسار", value: "inquiry" },
                    ]}
                    {...register("messageType")}
                    value={messageTypeWatch}
                    error={errors.messageType?.message}
                  />

                  {/* message */}
                  <Textarea
                    {...register("message")}
                    placeholder="اكتب هنا..."
                    error={errors.message?.message}
                    label="نص الرسالة"
                    maxLength={150}
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    variant="primary"
                    type="submit"
                    isLoading={isPending}
                    disabled={isPending}
                  >
                    إرسال
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </main>
  );
};

export default page;
