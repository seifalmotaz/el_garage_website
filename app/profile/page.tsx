"use client";
import CarCard from "@/components/CarCard";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import { negotiations } from "@/mock-data/negotiations";
import { notifications } from "@/mock-data/notifications";
import { orders } from "@/mock-data/orders";
import { wishlist } from "@/mock-data/wishlist";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Banner = () => {
  return (
    <div className="relative w-full lg:h-[427px] h-[375px] overflow-hidden flex flex-col justify-end text-center pb-8 md:pb-0">
      {/* Background Image */}
      <Image
        src="/images/car-details/banner.png"
        alt="Car Details Page Banner"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark Gradient Overlay */}

      {/* Content */}
      <div
        className="relative z-20 flex flex-col gap-3 px-6 lg:pb-[112px] pb-[44px]"
        dir="rtl"
      >
        <h1 className="lg:text-3xl  md:text-[38px] text-lg text-white leading-tight tracking-wide">
          الملف الشخصي
        </h1>
        <div className="flex items-center justify-center sm:gap-2 gap-1 text-xs md:text-sm text-gray-300 font-medium">
          <Link
            href="/"
            className="hover:text-white transition-colors flex gap-2 items-center max-sm:text-xs"
          >
            <Image
              src="/icons/home-2.svg"
              alt="Car Details Page Banner"
              width={24}
              height={24}
            />
            الصفحة الرئيسية
          </Link>
          <span className="text-gray-500">/</span>
          <Link
            href="/cars"
            className="hover:text-white transition-colors max-sm:text-xs"
          >
            الملف الشخصي
          </Link>
        </div>
      </div>
    </div>
  );
};

const OrdersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M17.084 8.49199H14.6757C12.7007 8.49199 11.0923 6.88366 11.0923 4.90866V2.50033C11.0923 2.04199 10.7173 1.66699 10.259 1.66699H6.72565C4.15898 1.66699 2.08398 3.33366 2.08398 6.30866V13.692C2.08398 16.667 4.15898 18.3337 6.72565 18.3337H13.2757C15.8423 18.3337 17.9173 16.667 17.9173 13.692V9.32532C17.9173 8.86699 17.5423 8.49199 17.084 8.49199Z"
      fill="#002EC1"
    />
    <path
      d="M13.1658 1.84207C12.8241 1.5004 12.2324 1.73373 12.2324 2.20873V5.11707C12.2324 6.33373 13.2658 7.34207 14.5241 7.34207C15.3158 7.3504 16.4158 7.3504 17.3574 7.3504C17.8324 7.3504 18.0824 6.79207 17.7491 6.45873C16.5491 5.2504 14.3991 3.0754 13.1658 1.84207Z"
      fill="#002EC1"
    />
    <path
      d="M11.25 11.458H6.25C5.90833 11.458 5.625 11.1747 5.625 10.833C5.625 10.4913 5.90833 10.208 6.25 10.208H11.25C11.5917 10.208 11.875 10.4913 11.875 10.833C11.875 11.1747 11.5917 11.458 11.25 11.458Z"
      fill="#002EC1"
    />
    <path
      d="M9.58333 14.792H6.25C5.90833 14.792 5.625 14.5087 5.625 14.167C5.625 13.8253 5.90833 13.542 6.25 13.542H9.58333C9.925 13.542 10.2083 13.8253 10.2083 14.167C10.2083 14.5087 9.925 14.792 9.58333 14.792Z"
      fill="#002EC1"
    />
  </svg>
);

const NegIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M13.5339 3.04199H6.46719C4.40885 3.04199 2.74219 4.71699 2.74219 6.76699V14.6087C2.74219 16.6587 4.41719 18.3337 6.46719 18.3337H13.5255C15.5839 18.3337 17.2505 16.6587 17.2505 14.6087V6.76699C17.2589 4.70866 15.5839 3.04199 13.5339 3.04199Z"
      fill="#002EC1"
    />
    <path
      d="M11.9585 1.66699H8.0418C7.17513 1.66699 6.4668 2.36699 6.4668 3.23366V4.01699C6.4668 4.88366 7.1668 5.58366 8.03346 5.58366H11.9585C12.8251 5.58366 13.5251 4.88366 13.5251 4.01699V3.23366C13.5335 2.36699 12.8251 1.66699 11.9585 1.66699Z"
      fill="#002EC1"
    />
    <path
      d="M12.4999 11.0419C12.1582 11.0419 11.8749 11.3252 11.8749 11.6669V12.6585L7.94154 8.7252C7.69987 8.48353 7.29987 8.48353 7.0582 8.7252C6.81654 8.96686 6.81654 9.36686 7.0582 9.60853L10.9915 13.5419H9.99987C9.6582 13.5419 9.37487 13.8252 9.37487 14.1669C9.37487 14.5085 9.6582 14.7919 9.99987 14.7919H12.4999C12.8415 14.7919 13.1249 14.5085 13.1249 14.1669V11.6669C13.1249 11.3252 12.8415 11.0419 12.4999 11.0419Z"
      fill="#002EC1"
    />
  </svg>
);

const FavIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.3327 7.24134C18.3327 8.23301 18.1743 9.14967 17.8993 9.99967H2.09935C1.82435 9.14967 1.66602 8.23301 1.66602 7.24134C1.66602 4.66634 3.74102 2.58301 6.29935 2.58301C7.80768 2.58301 9.15768 3.31634 9.99935 4.44134C10.841 3.31634 12.191 2.58301 13.6993 2.58301C16.2577 2.58301 18.3327 4.66634 18.3327 7.24134Z"
      fill="#002EC1"
    />
    <path
      opacity="0.4"
      d="M17.8996 10C16.5829 14.1667 12.5246 16.6583 10.5163 17.3417C10.2329 17.4417 9.76628 17.4417 9.48294 17.3417C7.47461 16.6583 3.41628 14.1667 2.09961 10H17.8996Z"
      fill="#002EC1"
    />
  </svg>
);

const NotificationsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M17.0003 13.608C16.767 14.233 16.2753 14.708 15.6337 14.9247C14.7337 15.2247 13.8087 15.4497 12.8753 15.608C12.7837 15.6247 12.692 15.6413 12.6003 15.6497C12.4503 15.6747 12.3003 15.6913 12.1503 15.708C11.967 15.733 11.7753 15.7497 11.5837 15.7663C11.0587 15.808 10.542 15.833 10.017 15.833C9.48367 15.833 8.95033 15.808 8.42533 15.758C8.20033 15.7413 7.98366 15.7163 7.767 15.683C7.642 15.6663 7.517 15.6497 7.40033 15.633C7.30866 15.6163 7.217 15.608 7.12533 15.5913C6.20033 15.4413 5.28367 15.2163 4.392 14.9163C3.72533 14.6913 3.217 14.2163 2.992 13.608C2.767 13.008 2.85033 12.308 3.20867 11.708L4.15033 10.1413C4.35033 9.79967 4.53367 9.14134 4.53367 8.74134V7.19134C4.53367 4.16634 6.992 1.70801 10.017 1.70801C13.0337 1.70801 15.492 4.16634 15.492 7.19134V8.74134C15.492 9.14134 15.6753 9.79967 15.8837 10.1413L16.8253 11.708C17.167 12.2913 17.2337 12.9747 17.0003 13.608Z"
      fill="#002EC1"
    />
    <path
      d="M10.0005 8.96621C9.65052 8.96621 9.36719 8.68288 9.36719 8.33288V5.74954C9.36719 5.39954 9.65052 5.11621 10.0005 5.11621C10.3505 5.11621 10.6339 5.39954 10.6339 5.74954V8.33288C10.6255 8.68288 10.3422 8.96621 10.0005 8.96621Z"
      fill="#002EC1"
    />
    <path
      d="M12.3587 16.6753C12.0087 17.642 11.0837 18.3337 10.0004 18.3337C9.34206 18.3337 8.69206 18.067 8.23372 17.592C7.96706 17.342 7.76706 17.0087 7.65039 16.667C7.75872 16.6837 7.86706 16.692 7.98372 16.7087C8.17539 16.7337 8.37539 16.7587 8.57539 16.7753C9.05039 16.817 9.53372 16.842 10.0171 16.842C10.4921 16.842 10.9671 16.817 11.4337 16.7753C11.6087 16.7587 11.7837 16.7503 11.9504 16.7253C12.0837 16.7087 12.2171 16.692 12.3587 16.6753Z"
      fill="#002EC1"
    />
  </svg>
);

const LangIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.37578 17.4245C6.35078 17.4245 6.31745 17.4412 6.29245 17.4412C4.67578 16.6412 3.35911 15.3162 2.55078 13.6995C2.55078 13.6745 2.56745 13.6412 2.56745 13.6162C3.58411 13.9162 4.63411 14.1412 5.67578 14.3162C5.85911 15.3662 6.07578 16.4079 6.37578 17.4245Z"
      fill="#002EC1"
    />
    <path
      d="M17.4492 13.7079C16.6242 15.3662 15.2492 16.7079 13.5742 17.5162C13.8909 16.4579 14.1576 15.3912 14.3326 14.3162C15.3826 14.1412 16.4159 13.9162 17.4326 13.6162C17.4242 13.6495 17.4492 13.6829 17.4492 13.7079Z"
      fill="#002EC1"
    />
    <path
      d="M17.5159 6.42507C16.4659 6.1084 15.4076 5.85007 14.3326 5.66673C14.1576 4.59173 13.8992 3.52507 13.5742 2.4834C15.2992 3.3084 16.6909 4.70007 17.5159 6.42507Z"
      fill="#002EC1"
    />
    <path
      d="M6.37409 2.5748C6.07409 3.59147 5.85742 4.6248 5.68242 5.6748C4.60742 5.84147 3.54076 6.10814 2.48242 6.4248C3.29076 4.7498 4.63242 3.3748 6.29076 2.5498C6.31576 2.5498 6.34909 2.5748 6.37409 2.5748Z"
      fill="#002EC1"
    />
    <path
      opacity="0.4"
      d="M12.9085 5.49199C10.9751 5.27533 9.02513 5.27533 7.0918 5.49199C7.30013 4.35033 7.5668 3.20866 7.9418 2.10866C7.95846 2.04199 7.95013 1.99199 7.95846 1.92533C8.6168 1.76699 9.2918 1.66699 10.0001 1.66699C10.7001 1.66699 11.3835 1.76699 12.0335 1.92533C12.0418 1.99199 12.0418 2.04199 12.0585 2.10866C12.4335 3.21699 12.7001 4.35033 12.9085 5.49199Z"
      fill="#002EC1"
    />
    <path
      opacity="0.4"
      d="M5.49102 12.9085C4.34102 12.7001 3.20768 12.4335 2.10768 12.0585C2.04102 12.0418 1.99102 12.0501 1.92435 12.0418C1.76602 11.3835 1.66602 10.7085 1.66602 10.0001C1.66602 9.30013 1.76602 8.6168 1.92435 7.9668C1.99102 7.95846 2.04102 7.95846 2.10768 7.9418C3.21602 7.57513 4.34102 7.30013 5.49102 7.0918C5.28268 9.02513 5.28268 10.9751 5.49102 12.9085Z"
      fill="#002EC1"
    />
    <path
      opacity="0.4"
      d="M18.3328 10.0001C18.3328 10.7085 18.2328 11.3835 18.0745 12.0418C18.0078 12.0501 17.9578 12.0418 17.8911 12.0585C16.7828 12.4251 15.6495 12.7001 14.5078 12.9085C14.7245 10.9751 14.7245 9.02513 14.5078 7.0918C15.6495 7.30013 16.7911 7.5668 17.8911 7.9418C17.9578 7.95846 18.0078 7.9668 18.0745 7.9668C18.2328 8.62513 18.3328 9.30013 18.3328 10.0001Z"
      fill="#002EC1"
    />
    <path
      opacity="0.4"
      d="M12.9085 14.5088C12.7001 15.6588 12.4335 16.7921 12.0585 17.8921C12.0418 17.9588 12.0418 18.0088 12.0335 18.0755C11.3835 18.2338 10.7001 18.3338 10.0001 18.3338C9.2918 18.3338 8.6168 18.2338 7.95846 18.0755C7.95013 18.0088 7.95846 17.9588 7.9418 17.8921C7.57513 16.7838 7.30013 15.6588 7.0918 14.5088C8.05846 14.6171 9.02513 14.6921 10.0001 14.6921C10.9751 14.6921 11.9501 14.6171 12.9085 14.5088Z"
      fill="#002EC1"
    />
    <path
      opacity="0.4"
      d="M13.1355 13.1364C11.0512 13.3994 8.94749 13.3994 6.86324 13.1364C6.60027 11.0522 6.60027 8.94846 6.86324 6.86422C8.94749 6.60125 11.0512 6.60125 13.1355 6.86422C13.3984 8.94846 13.3984 11.0522 13.1355 13.1364Z"
      fill="#002EC1"
    />
  </svg>
);

const DeleteAccountIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.99935 1.66699C7.81602 1.66699 6.04102 3.44199 6.04102 5.62533C6.04102 7.76699 7.71602 9.50033 9.89935 9.57533C9.96602 9.56699 10.0327 9.56699 10.0827 9.57533C10.0993 9.57533 10.1077 9.57533 10.1243 9.57533C10.1327 9.57533 10.1327 9.57533 10.141 9.57533C12.2743 9.50033 13.9493 7.76699 13.9577 5.62533C13.9577 3.44199 12.1827 1.66699 9.99935 1.66699Z"
      fill="#EF4444"
    />
    <path
      opacity="0.4"
      d="M14.2328 11.7914C11.9078 10.2414 8.11615 10.2414 5.77448 11.7914C4.71615 12.4997 4.13281 13.4581 4.13281 14.4831C4.13281 15.5081 4.71615 16.4581 5.76615 17.1581C6.93281 17.9414 8.46615 18.3331 9.99948 18.3331C11.5328 18.3331 13.0661 17.9414 14.2328 17.1581C15.2828 16.4497 15.8661 15.4997 15.8661 14.4664C15.8578 13.4414 15.2828 12.4914 14.2328 11.7914Z"
      fill="#EF4444"
    />
    <path
      d="M10.8824 14.4835L11.6158 13.7501C11.8574 13.5085 11.8574 13.1085 11.6158 12.8668C11.3741 12.6251 10.9741 12.6251 10.7324 12.8668L9.99909 13.6001L9.26575 12.8668C9.02409 12.6251 8.62409 12.6251 8.38242 12.8668C8.14076 13.1085 8.14076 13.5085 8.38242 13.7501L9.11575 14.4835L8.38242 15.2168C8.14076 15.4585 8.14076 15.8585 8.38242 16.1001C8.50742 16.2251 8.66575 16.2835 8.82409 16.2835C8.98242 16.2835 9.14075 16.2251 9.26575 16.1001L9.99909 15.3668L10.7324 16.1001C10.8574 16.2251 11.0158 16.2835 11.1741 16.2835C11.3324 16.2835 11.4908 16.2251 11.6158 16.1001C11.8574 15.8585 11.8574 15.4585 11.6158 15.2168L10.8824 14.4835Z"
      fill="#EF4444"
    />
  </svg>
);

const LogOutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M7.5 6.00033V13.992C7.5 16.667 9.16667 18.3337 11.8333 18.3337H13.9917C16.6583 18.3337 18.325 16.667 18.325 14.0003V6.00033C18.3333 3.33366 16.6667 1.66699 14 1.66699H11.8333C9.16667 1.66699 7.5 3.33366 7.5 6.00033Z"
      fill="#EF4444"
    />
    <path
      d="M4.64089 6.7666L1.84922 9.55827C1.60755 9.79994 1.60755 10.1999 1.84922 10.4416L4.64089 13.2333C4.88255 13.4749 5.28255 13.4749 5.52422 13.2333C5.76589 12.9916 5.76589 12.5916 5.52422 12.3499L3.79922 10.6249H12.7076C13.0492 10.6249 13.3326 10.3416 13.3326 9.99993C13.3326 9.65827 13.0492 9.37493 12.7076 9.37493H3.79922L5.52422 7.64994C5.64922 7.52494 5.70755 7.3666 5.70755 7.20827C5.70755 7.04993 5.64922 6.88327 5.52422 6.7666C5.28255 6.5166 4.89089 6.5166 4.64089 6.7666Z"
      fill="#EF4444"
    />
  </svg>
);

const profilePage = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [activeOrderTab, setActiveOrderTab] = useState(0);
  const [activeNegTab, setActiveNegTab] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<"ar" | "eng">("ar");

  const sections = [
    { label: "طلباتي", Icon: <OrdersIcon /> },
    { label: "مفاوضاتي", Icon: <NegIcon /> },
    { label: "مفضلاتي", Icon: <FavIcon /> },
    { label: "الاشعارات", Icon: <NotificationsIcon /> },
    { label: "حدد اللغة", Icon: <LangIcon /> },
  ];

  const tabs = ["الحالية", "المستلمة", "الملغية"];

  return (
    <main className="">
      <Banner />

      <section>
        <MaxWidthWrapper className="py-[52px] 2xl:px-[182px]">
          <div className="relative p-6 bg-gray-100 rounded-[32px] min-h-screen flex max-lg:flex-col gap-6">
            {/* right */}
            <div className="w-[292px] h-full flex flex-col gap-6">
              <div className="bg-white rounded-[24px] flex flex-col items-center border border-gray-200 p-[32px]">
                <Image
                  src={"/avatar.svg"}
                  alt="avatar"
                  width={75}
                  height={75}
                />
                <div className="space-y-1 text-center mt-[12px] mb-[24px]">
                  <h1 className="font-semibold text-[20px]">أدم علي</h1>
                  <h3 className="font-medium text-sm">201025647981+</h3>
                </div>

                <Button variant="black">تعديل الملف الشخصي</Button>
              </div>

              {/* sections */}
              <div className="space-y-3">
                {sections.map((sec, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveSection(i)}
                    className="px-2.5 py-[15px] bg-white border border-gray-200 first:rounded-lg rounded-2xl cursor-pointer flex items-center gap-1 text-sm leading-[150%] font-medium"
                  >
                    <span className={activeSection === i ? "" : "grayscale"}>
                      {sec.Icon}
                    </span>
                    <span
                      className={
                        activeSection === i
                          ? "text-primary-500"
                          : "text-gray-500"
                      }
                    >
                      {sec.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="bg-white py-[15px] px-2 rounded-2xl text-gray-500 flex items-center gap-1 text-sm flex-1 hover:opacity-85 hover:text-black duration">
                  <LogOutIcon />
                  تسجيل الخروج
                </button>
                <button className="bg-white py-[15px] px-2 rounded-2xl text-gray-500 flex items-center gap-1 text-sm flex-1 hover:opacity-85 hover:text-black duration">
                  <DeleteAccountIcon />
                  حذف الحساب
                </button>
              </div>
            </div>

            {/* left */}
            <div className="bg-white flex-1 rounded-[24px] border border-gray-200 p-6 h-full">
              <h2 className="text-[16px] font-medium">
                {sections[activeSection].label}
              </h2>

              {activeSection === 0 ? (
                <>
                  <div className="flex border-b border-gray-300">
                    {tabs.map((t, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveOrderTab(i)}
                        className={cn(
                          "w-[132px] h-[48px] border-b  flex justify-center items-center cursor-pointer relative",
                          activeOrderTab === i
                            ? "border-primary-500 text-primary-500"
                            : "border-gray-300 text-gray-500",
                        )}
                      >
                        {t}
                      </div>
                    ))}
                  </div>

                  {activeOrderTab === 0 ? (
                    <div className="mt-6 space-y-4">
                      {orders.map((order, i) => (
                        <div key={i} className="flex gap-2.5">
                          <div className="relative w-[177px] aspect-[177/115]">
                            <Image
                              src={order.image}
                              alt="car"
                              className="rounded-2xl aspect-[177/115]"
                              fill
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between border border-[#F2F2F2] rounded-2xl p-3">
                            <div className="space-y-1 font-sm">
                              <h2>
                                {order.brand}-{order.model}
                              </h2>
                              <p className="text-gray-500 text-xs">
                                {order.date}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <h2 className="text-primary-500">
                                <span className="font-semibold">
                                  {order.price}
                                </span>{" "}
                                <span className="text-primary-400 text-sm">
                                  ج.م
                                </span>
                              </h2>
                              <Button
                                variant="secondary"
                                className="w-[120px] font-medium"
                              >
                                تفاصيل الطلب
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activeOrderTab === 1 ? (
                    <div className="mt-4">
                      <h1>لا توجد مفاوضات مستلمة</h1>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h1>لا توجد مفاوضات ملغية</h1>
                    </div>
                  )}
                </>
              ) : activeSection === 1 ? (
                <>
                  <div className="flex border-b border-gray-300">
                    {tabs.map((t, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveNegTab(i)}
                        className={cn(
                          "w-[132px] h-[48px] border-b  flex justify-center items-center cursor-pointer",
                          activeNegTab === i
                            ? "border-primary-500 text-primary-500"
                            : "border-gray-300 text-gray-500",
                        )}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                  {activeNegTab === 0 ? (
                    <div className="mt-6 space-y-4">
                      {negotiations.map((neg, i) => (
                        <div
                          key={i}
                          className="flex justify-between border border-[#F2F2F2] rounded-2xl p-3"
                        >
                          <div className="flex items-center gap-2">
                            <div className="size-9 rounded-[14px] bg-[#F2F2F2] flex items-center justify-center">
                              <NegIcon />
                            </div>

                            <div className="flex items-start gap-4">
                              <div>
                                <h3 className="text-sm">{neg.label}</h3>
                                <p className="text-xs text-[#666666]">
                                  {neg.lastOrder}
                                </p>
                              </div>

                              <Badge
                                text={neg.status}
                                status={
                                  neg.status === "مكتمل"
                                    ? "completed"
                                    : neg.status === "ملغي"
                                      ? "canceled"
                                      : "pending"
                                }
                              />
                            </div>
                          </div>

                          <div className="border border-[#E5E7EB] size-10 flex items-center justify-center rounded-full cursor-pointer">
                            <ChevronLeft strokeWidth={1} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activeNegTab === 1 ? (
                    <div className="mt-4">
                      <h1>لا توجد مفاوضات مستلمة</h1>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h1>لا توجد مفاوضات ملغية</h1>
                    </div>
                  )}
                </>
              ) : activeSection === 2 ? (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {wishlist.map((car, i) => (
                    <CarCard key={i} {...car} />
                  ))}
                </div>
              ) : activeSection === 3 ? (
                <div className="space-y-4 mt-4">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="flex justify-between border border-[#F2F2F2] rounded-2xl p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="size-9 rounded-[14px] bg-[#F2F2F2] flex items-center justify-center">
                          <NotificationsIcon />
                        </div>

                        <div>
                          <h3 className="text-sm">{n.label}</h3>
                          <p className="text-xs text-[#666666]">{n.body}</p>
                        </div>
                      </div>

                      <span className="text-xs text-[#666666]">{n.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div
                    className={cn(
                      "p-4 bg-[#FAFAFA] border rounded-2xl flex items-center gap-4 cursor-pointer",
                      selectedLanguage === "ar"
                        ? "border-primary-500"
                        : "border-[#F2F2F2]",
                    )}
                    onClick={() => setSelectedLanguage("ar")}
                  >
                    <span
                      className={cn(
                        "size-[14px] rounded-full border flex items-center justify-center",
                        selectedLanguage === "ar"
                          ? "border-primary-500"
                          : "border-[#999999]",
                      )}
                    >
                      {selectedLanguage === "ar" && (
                        <span className="size-[10px] bg-primary-500 rounded-full"></span>
                      )}
                    </span>

                    <h3>العربية</h3>
                  </div>

                  <div
                    className={cn(
                      "p-4 bg-[#FAFAFA] border rounded-2xl flex items-center gap-4 cursor-pointer",
                      selectedLanguage === "eng"
                        ? "border-primary-500"
                        : "border-[#F2F2F2]",
                    )}
                    onClick={() => setSelectedLanguage("eng")}
                  >
                    <span
                      className={cn(
                        "size-[14px] rounded-full border flex items-center justify-center",
                        selectedLanguage === "eng"
                          ? "border-primary-500"
                          : "border-[#999999]",
                      )}
                    >
                      {selectedLanguage === "eng" && (
                        <span className="size-[10px] bg-primary-500 rounded-full"></span>
                      )}
                    </span>

                    <h3>English</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </main>
  );
};

export default profilePage;
