"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function CallIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M19.79 14.93C17.73 16.98 14.78 17.61 12.19 16.8L7.48 21.5C7.14 21.85 6.47 22.06 5.99 21.99L3.81 21.69C3.09 21.59 2.42 20.91 2.31 20.19L2.01 18.01C1.94 17.53 2.17 16.86 2.5 16.52L7.2 11.82C6.4 9.22 7.02 6.27 9.08 4.22C12.03 1.27 16.82 1.27 19.78 4.22C22.74 7.17 22.74 11.98 19.79 14.93Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.89 17.49L9.19 19.79"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 11C15.3284 11 16 10.3284 16 9.5C16 8.67157 15.3284 8 14.5 8C13.6716 8 13 8.67157 13 9.5C13 10.3284 13.6716 11 14.5 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21.11 9.4C22.01 10.81 22.01 13.18 21.11 14.59C18.82 18.19 15.53 20.27 12 20.27C8.47 20.27 5.18 18.19 2.89 14.59C1.99 13.18 1.99 10.81 2.89 9.4C5.18 5.8 8.47 3.73 12 3.73C15.53 3.73 18.82 5.8 21.11 9.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M14.53 9.47L9.47 14.53C8.82 13.88 8.42 12.99 8.42 12C8.42 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.42 19.53C9.56 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C20.78 8.88 20.42 8.39 20.05 7.93"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.47 14.53L2 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L14.53 9.47"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-12 bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-[376px] flex flex-col gap-[52px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[10px] w-fit self-center" dir="ltr">
            <div className="relative w-11 h-11">
              <Image
                src="/assets/logo_shield_color.svg"
                alt="elGARAGE Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-[160px] h-[22px]">
              <Image
                src="/assets/logo_text_dark.svg"
                alt="elGARAGE"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Form Section */}
          <div className="flex flex-col gap-8">
            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground text-center">
              تسجيل <span className="text-[#002ec1]">الدخول</span>
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[72px]"
            >
              {/* Fields */}
              <div className="flex flex-col gap-4 w-full">
                {/* Phone */}
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="phone"
                    className="text-sm text-foreground text-right font-normal"
                  >
                    رقم الجوال
                  </label>
                  <div
                    className="bg-gray-50 flex items-center justify-between px-3 py-2 rounded-2xl min-h-[50px]"
                    dir="ltr"
                  >
                    <div className="flex items-center gap-2 text-foreground text-sm">
                      <span className="font-sans text-sm">+966</span>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="14444444"
                        className="bg-transparent outline-none w-[120px] text-sm font-light text-foreground placeholder:text-gray-300 text-left"
                      />
                    </div>
                    <span className="text-foreground">
                      <CallIcon />
                    </span>
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="password"
                    className="text-sm text-foreground text-right font-normal"
                  >
                    كلمة السر
                  </label>
                  <div
                    className="bg-gray-50 flex items-center justify-between px-3 py-2 rounded-2xl min-h-[50px]"
                    dir="ltr"
                  >
                    {/* Eye toggle (LTR: left) */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                      className="text-foreground hover:text-primary-500 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                    </button>

                    {/* Input + Key (LTR: right) */}
                    <div className="flex items-center gap-1.5">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="bg-transparent outline-none text-sm text-foreground placeholder:text-gray-300 text-right font-light"
                      />
                      <span className="text-foreground">
                        <KeyIcon />
                      </span>
                    </div>
                  </div>

                  <Link
                    href="#"
                    className="text-sm text-foreground text-right hover:text-primary-500 transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 w-full">
                <button
                  type="submit"
                  className="bg-foreground text-white rounded-2xl min-h-[48px] font-semibold text-sm w-full transition-opacity hover:opacity-90 cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <Link
                  href="#"
                  className="text-foreground min-h-[48px] font-semibold text-sm w-full flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  انشاء الحساب
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

      {/* Left Side - Hero */}
      <div className="relative hidden md:block md:w-[45%] lg:w-[50%] xl:w-[55%] overflow-hidden bg-[#0c295a]">
        <Image
          src="/assets/login_hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Dark base overlay */}
        <div className="absolute inset-0 bg-[rgba(0,6,23,0.2)]" />
        {/* Primary tint to deepen brand */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-800/40 via-primary-800/30 to-primary-800/75" />

        {/* Heading block (per-line highlight via box-decoration-break) */}
        <div className="absolute top-[80px] lg:top-[100px] right-0 left-0 flex justify-center px-6">
          <h1
            className="font-bold text-white text-3xl lg:text-5xl leading-[1.6] text-center max-w-[656px]"
            style={{
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            <span className="bg-primary-800 px-3 py-2">
              انضم للجراج الآن و اكتشف سياراتك المفضلة
            </span>
          </h1>
        </div>

        {/* Bottom subtext */}
        <div className="absolute bottom-[80px] lg:bottom-[100px] right-0 left-0 flex justify-center px-6">
          <p className="font-normal text-white text-xl lg:text-3xl leading-normal text-center max-w-[769px]">
            سجل مجانًا واحصل على إشعارات السيارات الجديدة فحوصات فورية، وأفضل
            العروض اليومية
          </p>
        </div>
      </div>
    </div>
  );
}
