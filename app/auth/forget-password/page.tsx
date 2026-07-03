"use client";
import { VerficationCodeSvg } from "@/components/svg/Svgs";
import LeftSideHero from "@/components/form/LeftSideHero";
import Logo from "@/components/form/Logo";
import ChangePassword from "@/components/form/ChangePassword";
import CodeVerification from "@/components/form/CodeVerfication";
import PhoneOrEmail from "@/components/form/PhoneOrEmail";

export default function ForgetPasswordPage() {
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

          {/* form steps */}
          {/* step 1 */}
          <PhoneOrEmail />

          {/* step 2 */}
          {/* <CodeVerification /> */}

          {/* step 3 */}
          {/* <ChangePassword /> */}
        </div>
      </div>

      <LeftSideHero />
    </div>
  );
}
