import Image from "next/image";
import MaxWidthWrapper from "./common/MaxWidthWrapper";

export default function DownloadApp() {
  return (
    <section className="w-full flex items-center justify-center pt-28 pb-16 lg:pt-16 lg:pb-24  text-right bg-white">
      <MaxWidthWrapper className="relative w-full min-h-[462px] lg:h-[462px] bg-[#f8f9fa] rounded-3xl overflow-visible flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-[72px] py-12 lg:py-0 gap-10 lg:gap-0">
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
    </section>
  );
}
