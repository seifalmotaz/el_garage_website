"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  FacebookIcon,
  InstagramIcon,
  TiwtterIcon,
  YoutubeIcon,
} from "../svg/Svgs";

const legalLinks = [
  { label: "الشروط و الأحكام", href: "#" },
  { label: "سياسة الخصوصية", href: "#" },
];
const directLinksCol1 = [
  { label: "الصفحة الرئيسية", href: "/" },
  { label: "تصفح السيارات", href: "/cars" },
  { label: "السيارات المميزة", href: "/#grid-featured" },
];
const directLinksCol2 = [
  { label: "المقالات", href: "/blog" },
  { label: "الأسئلة الشائعة", href: "/#faq" },
  { label: "تواصل معنا", href: "/#footer" },
];
const socialIcons = [
  { name: "instagram", icon: "/assets/social_instagram.svg" },
  { name: "twitter", icon: "/assets/social_twitter.svg" },
  { name: "facebook", icon: "/assets/social_facebook.svg" },
  { name: "youtube", icon: "/assets/social_youtube.svg" },
];

export default function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/auth/")) setShowFooter(true);
    else setShowFooter(false);
  }, [pathname]);

  return !showFooter ? (
    <></>
  ) : (
    <>
      <MaxWidthWrapper className="relative w-full min-h-[462px] lg:h-[462px] bg-[#f8f9fa] rounded-3xl overflow-visible flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-[72px] py-12 my-20 lg:py-0 gap-10 lg:gap-0">
        {/* Background illustration */}
        <Image
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[909px] h-[467px] object-cover pointer-events-none z-0"
          width={909}
          height={467}
          alt=""
          src="/assets/download_bg_pattern.svg"
        />

        {/* Bottom decoration */}
        <Image
          className="absolute bottom-0 left-[31px] w-[312.7px] h-[109px] pointer-events-none z-0 hidden lg:block"
          width={312.7}
          height={109}
          alt=""
          src="/assets/download_bottom_pattern.svg"
        />

        {/* Phone mockup for mobile (shown only below lg, floating/overlapping top, rendered first) */}
        <div className="relative w-full max-w-[440px] aspect-[501/567] z-10 block lg:hidden -mt-[112px] mb-6">
          <Image
            className="w-full h-full object-contain"
            fill
            alt="ElGarage Mobile App Screens"
            src="/assets/app_phones_mockup.png"
            priority
          />
        </div>

        {/* Text & Store Badges Column (Right in RTL) */}
        <div className="w-full lg:w-[378px] flex flex-col items-center lg:items-start text-center lg:text-right gap-8 lg:gap-12 z-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#002853] leading-tight">
              حمّل تطبيق ElGarage دلوقتي
            </h2>
            <p className="text-base md:text-lg text-gray-500 font-normal">
              شوف العربيات، اعرف حالتها من تقرير الفحص، وكمّل شراءك بسهولة.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start gap-4">
            <span className="text-base md:text-lg font-semibold text-gray-800">
              حمّل التطبيق وابدأ بثقة
            </span>
            <div className="flex items-start gap-3">
              <a href="#" className="block hover:opacity-90 transition-opacity">
                <Image
                  className="h-11 w-[148.5px] rounded-[5px] object-contain"
                  width={148.5}
                  height={44}
                  alt="Google Play"
                  src="/assets/google_play_badge.svg"
                />
              </a>
              <a href="#" className="block hover:opacity-90 transition-opacity">
                <Image
                  className="h-11 w-[132px] rounded-[7px] object-contain"
                  width={132}
                  height={44}
                  alt="App Store"
                  src="/assets/app_store_badge.svg"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Phone mockup for desktop (shown only at lg and above, floating) */}
        <Image
          className="absolute top-[-52px] left-[calc(50%-250px)] w-[501px] h-[567px] object-contain pointer-events-none z-10 hidden lg:block"
          width={501}
          height={567}
          alt="ElGarage Mobile App Screens"
          src="/assets/app_phones_mockup.png"
        />

        {/* QR Code Column (Left in RTL, Bottom on Mobile/Tablet) */}
        <div className="hidden md:flex w-full lg:w-[251px] flex-col items-center gap-4 text-center z-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-sm font-semibold text-gray-700">
            افتح الكاميرا و امسح الكود
          </span>
          <div className="p-2 border border-gray-100 rounded-xl bg-gray-50">
            <Image
              className="w-[152px] h-[152px] rounded-lg object-contain"
              width={152}
              height={152}
              alt="QR Code"
              src="/assets/download_qrcode.png"
            />
          </div>
          <p className="text-xs text-gray-500 leading-normal">
            تحويل فوري لصفحة التحميل—في ثوانٍ ومن غير تسجيل أو خطوات إضافية.
          </p>
        </div>
      </MaxWidthWrapper>
      <footer
        id="footer"
        className="relative bg-gradient-to-t from-[#002853] to-[#002ec1] text-white select-none overflow-hidden"
      >
        <div>
          {/* Background mechanic image */}
          <Image
            className="absolute top-0 bottom-0 left-[-358px] w-[808px] h-full object-cover shrink-0 pointer-events-none z-0 hidden lg:block"
            width={808}
            height={512}
            alt=""
            src="/assets/footer_bg_mechanic.png"
          />

          {/* Main Content Container (Responsive flow layout) */}
          <MaxWidthWrapper className="relative mx-auto pt-16 pb-20 z-10 flex flex-col items-start gap-12 w-full">
            {/* Top Row: Logo & Tagline */}
            <div className="w-full max-w-[347px] flex flex-col items-start gap-6">
              <Image
                src="/assets/footer_logo.png"
                width={176}
                height={36}
                alt="elGARAGE"
                className="object-contain"
              />
              <p className="text-base leading-relaxed opacity-95">
                منصة الجراج — الوجهة الأولى لبيع وشراء السيارات المستعملة في مصر
                بضمان الفحص الاحترافي.
              </p>
            </div>

            {/* Columns Row */}
            <div className="w-full flex flex-col md:flex-row items-start justify-start gap-10 md:gap-16 lg:gap-[120px] pt-4 flex-wrap">
              {/* Column C: Contact */}
              <div className="flex flex-col items-start gap-4 min-w-[234px] order-3 md:order-none">
                <h3 className="text-xl font-bold leading-normal">تواصل معنا</h3>
                <div className="flex flex-col items-start gap-3 text-sm">
                  <a
                    href="tel:19900"
                    className="flex items-center gap-2 hover:text-white/80 transition-colors"
                  >
                    <Image
                      src="/assets/mobile_footer.svg"
                      width={32}
                      height={32}
                      alt="phone"
                    />
                    <span className="font-mono">19900</span>
                  </a>
                  <a
                    href="mailto:info@elgarage.eg"
                    className="flex items-center gap-2 hover:text-white/80 transition-colors"
                  >
                    <Image
                      src="/assets/sms_footer.svg"
                      width={32}
                      height={32}
                      alt="email"
                    />
                    <span className="font-mono">info@elgarage.eg</span>
                  </a>
                  <div className="flex items-center gap-2 text-right">
                    <Image
                      src="/assets/location_footer.svg"
                      width={32}
                      height={32}
                      alt="location"
                      className="shrink-0"
                    />
                    <span>القاهرة، مصر الجديدة، شارع الثورة</span>
                  </div>
                </div>
              </div>

              {/* Column B: Direct Links */}
              <div className="flex flex-col items-start gap-4 min-w-[251px] order-2 md:order-none">
                <h3 className="text-xl font-bold leading-normal">
                  روابط مباشرة
                </h3>
                <div className="flex gap-[64px]">
                  <div className="flex flex-col items-start gap-4">
                    {directLinksCol1.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="text-sm text-white/80 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    {directLinksCol2.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="text-sm text-white/80 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column A: Legal */}
              <div className="flex flex-col items-start gap-4 min-w-[107px] order-1 md:order-none">
                <h3 className="text-xl font-bold leading-normal">قانوني</h3>
                <div className="flex flex-col items-start gap-4">
                  {legalLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </MaxWidthWrapper>

          {/* Bottom Bar: Copyright & Socials */}
          <div className="w-full bg-[#191919] py-4 border-t border-white/5 z-10 relative">
            <MaxWidthWrapper className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm text-center md:text-right">
                جميع الحقوق محفوظة لدى منصة elGARAGE
              </p>
              <div className="flex items-center flex-row-reverse gap-4">
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-white/12 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <YoutubeIcon />
                </Link>
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-white/12 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-white/12 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <TiwtterIcon />
                </Link>
                <Link
                  href="#"
                  className="w-11 h-11 rounded-full border border-white/12 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <InstagramIcon />
                </Link>
              </div>
            </MaxWidthWrapper>
          </div>
        </div>
      </footer>
    </>
  );
}
