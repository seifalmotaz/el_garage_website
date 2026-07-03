import Image from "next/image";

export default function InspectionBanner() {
  return (
    <section className="relative w-full min-h-[400px] md:min-h-[449px] py-12 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center text-gray-900 md:text-white bg-white md:bg-transparent overflow-hidden select-none">
      
      {/* Background and Overlay - Desktop Only */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/assets/services_bg.png"
          alt="Inspection Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,22,91,0.3)] to-primary-500" />
      </div>

      {/* Decorative BG pattern (aligned to right, full opacity) - Desktop Only */}
      <div className="absolute top-[-106px] right-[-555px] w-[953.935px] h-[812.222px] pointer-events-none z-10 hidden md:block">
        <Image
          src="/assets/mechanic_banner_bg_pattern.svg"
          alt="pattern"
          fill
          className="object-contain"
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-20 w-full max-w-[1336px] flex flex-col md:flex-row justify-start gap-8 items-center md:items-start">
        
        {/* Mobile Standalone Image Card - Mobile Only */}
        <div className="relative w-full max-w-[337px] h-[201px] rounded-[24px] overflow-hidden mb-6 md:hidden shadow-sm">
          <Image
            src="/assets/services_bg.png"
            alt="Inspection illustration"
            fill
            className="object-cover"
          />
        </div>

        {/* Text Details and Button Group */}
        <div className="text-right flex flex-col items-center md:items-start gap-6 max-w-[600px] w-full max-w-[337px] md:max-w-[600px]">
          <div className="flex flex-col gap-4.5 w-full">
            <span className="text-gray-500 md:text-white text-base md:text-2xl font-semibold uppercase">
              خدمة مميزة
            </span>
            <div className="flex flex-col gap-3 md:gap-4 w-full">
              <h2 className="text-primary-500 md:text-white text-3xl md:text-4xl lg:text-[52px] font-bold leading-tight md:leading-[1.2]">
                فحص احترافي معتمد
              </h2>
              <p className="text-gray-500 md:text-white text-sm md:text-lg lg:text-[18px] font-medium leading-relaxed max-w-[549px]">
                احصل على تقرير فحص شامل لأكثر من 200 نقطة من مفتشينا المعتمدين قبل الشراء
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full flex justify-center md:justify-start">
            <a
              href="https://wa.me/19900"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-primary-50 md:hover:bg-gray-50 text-primary-500 font-semibold text-sm h-10 px-8 rounded-2xl flex items-center justify-center gap-2 border border-primary-500 md:border-[rgba(255,255,255,0.17)] shadow-md transition-colors w-full md:w-auto"
            >
              <Image
                src="/assets/whatsapp_logo.svg"
                alt="whatsapp"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>تواصل معنا الان</span>
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
