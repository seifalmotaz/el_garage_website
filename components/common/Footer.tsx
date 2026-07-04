"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";

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
              <h3 className="text-xl font-bold leading-normal">روابط مباشرة</h3>
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
            <div className="flex items-center gap-4">
              {socialIcons.map((soc, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-11 h-11 rounded-full border border-white/12 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Image
                    src={soc.icon}
                    alt={soc.name}
                    width={19}
                    height={19}
                    className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </MaxWidthWrapper>
        </div>
      </div>
    </footer>
  );
}
