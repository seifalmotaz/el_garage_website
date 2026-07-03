import Image from "next/image";

export default function WhyUs() {
  const stats = [
    {
      value: "+1,200",
      label: "سيارة معروضة",
      subLabel: "Vehicle for sale",
      icon: "/assets/car_features_icon.svg",
    },
    {
      value: "+500",
      label: "فحص مكتمل",
      subLabel: "Complete check",
      icon: "/assets/radar.svg",
    },
    {
      value: "4.9",
      label: "تقييم المستخدمين",
      subLabel: "Customer reviews",
      icon: "/assets/star.svg",
    },
  ];

  return (
    <section className="bg-white py-16 px-4 flex flex-col items-center gap-12 w-full">
      
      {/* Title & description */}
      <div className="text-center flex flex-col gap-4 max-w-[800px]">
        <h2 className="text-primary-800 font-bold text-3xl md:text-4xl">
          لماذا الجراج
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          لأننا نعرض سيارات مستعملة مفحوصة شاملاً في أكثر من 250 نقطة دقيقة بواسطة خبراء، مع تقييمات حقيقية من آلاف المستخدمين الراضين، وضمان جودة يصل لـ90 يوم—كل ده عشان تشتري بثقة كاملة وتبيع بأعلى سعر عادل بدون مخاطر.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:flex md:flex-row md:items-center md:justify-center md:gap-16 w-auto max-w-[320px] md:max-w-[900px]">
        {stats.map((stat, idx) => {
          const curveTopId = `curve-top-${idx}`;
          const curveBottomId = `curve-bottom-${idx}`;

          return (
            <div 
              key={idx} 
              className={`flex flex-col items-center justify-center relative w-[140px] h-[140px] md:w-[162px] md:h-[162px] select-none ${
                idx === 2 ? "col-span-2 justify-self-center mt-2" : "col-span-1"
              }`}
            >
              
              {/* Concentric SVG Curved Text */}
              <svg width="100%" height="100%" viewBox="0 0 162 162" className="absolute inset-0 z-20 pointer-events-none">
                <defs>
                  {/* Top curve (left to right clockwise) */}
                  <path id={curveTopId} d="M 17 81 A 64 64 0 0 1 145 81" fill="none" />
                  {/* Bottom curve (right to left clockwise) */}
                  <path id={curveBottomId} d="M 145 81 A 64 64 0 0 1 17 81" fill="none" />
                </defs>
                
                {/* English Label curved at top */}
                <text className="text-[10px] fill-gray-400 font-medium font-mono">
                  <textPath href={`#${curveTopId}`} startOffset="50%" textAnchor="middle">
                    {stat.subLabel}
                  </textPath>
                </text>

                {/* Arabic Label curved at bottom */}
                <text className="text-[10px] fill-primary-800 font-bold font-sans">
                  <textPath href={`#${curveBottomId}`} startOffset="50%" textAnchor="middle">
                    {`. ${stat.label} .`}
                  </textPath>
                </text>
              </svg>

              {/* Inner Solid Blue Circle */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-500 shadow-md flex flex-col items-center justify-center gap-1.5 z-10">
                <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <span className="font-bold text-base md:text-lg text-white font-mono leading-none">
                  {stat.value}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Two Cars Image */}
      <div className="w-full max-w-[834px] h-[118px] sm:h-[200px] md:h-[294px] relative mt-4 select-none">
        <Image
          src="/assets/why_cars.png"
          alt="Why El Garage cars"
          fill
          className="object-contain"
        />
      </div>

    </section>
  );
}
