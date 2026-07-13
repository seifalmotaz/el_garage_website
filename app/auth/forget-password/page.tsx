"use client";
import { useState } from "react";
import { VerficationCodeSvg } from "@/components/svg/Svgs";
import LeftSideHero from "@/components/form/LeftSideHero";
import Logo from "@/components/form/Logo";
import ChangePassword from "@/components/form/ChangePassword";
import CodeVerification from "@/components/form/CodeVerfication";
import PhoneOrEmail from "@/components/form/PhoneOrEmail";

type ForgetPasswordStep = "phone" | "code" | "password";

export default function ForgetPasswordPage() {
  // Step state for the 3-step forget-password flow.
  // The `phone` and `otpCode` are threaded forward to the next step's
  // component so each step knows what it received from the previous.
  const [step, setStep] = useState<ForgetPasswordStep>("phone");
  const [phone, setPhone] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");

  return (
    <div className="flex min-h-screen bg-white">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-12 bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-[376px] flex flex-col">
          {/* Logo */}
          <div className="flex flex-col items-center gap-[52px] mb-[52px]">
            <Logo />
            <VerficationCodeSvg />
          </div>

          {/* step 1: phone or email */}
          {step === "phone" && (
            <PhoneOrEmail
              onSuccess={(phoneE164) => {
                setPhone(phoneE164);
                setStep("code");
              }}
            />
          )}

          {/* step 2: verification code */}
          {step === "code" && (
            <CodeVerification
              phone={phone}
              onSuccess={(code) => {
                setOtpCode(code);
                setStep("password");
              }}
            />
          )}

          {/* step 3: new password */}
          {step === "password" && (
            <ChangePassword phone={phone} otpCode={otpCode} />
          )}
        </div>
      </div>

      <LeftSideHero />
    </div>
  );
}