import Image from "next/image";
import MaxWidthWrapper from "./common/MaxWidthWrapper";

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
    <section className="bg-white lg:py-13 py-8 w-full">
      <MaxWidthWrapper className="flex flex-col items-center gap-7.5">
        {/* Title & description */}
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-primary-800 font-bold text-3xl md:text-4xl  leading-normal">
            لماذا الجراج
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            لأننا نعرض سيارات مستعملة مفحوصة شاملاً في أكثر من 250 نقطة دقيقة
            بواسطة خبراء، مع تقييمات حقيقية من آلاف المستخدمين الراضين، وضمان
            جودة يصل لـ90 يوم—كل ده عشان تشتري بثقة كاملة وتبيع بأعلى سعر عادل
            بدون مخاطر.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-6 md:flex md:flex-row md:items-center md:justify-center md:gap-16">
          <Image
            src={"/images/home/why-us-1.svg"}
            alt="why us"
            width={160}
            height={160}
          />
          <Image
            src={"/images/home/why-us-2.svg"}
            alt="why us"
            width={160}
            height={160}
          />
          <Image
            src={"/images/home/why-us-3.svg"}
            alt="why us"
            width={160}
            height={160}
          />
        </div>

        {/* Two Cars Image */}
        <div className="w-full h-[118px] sm:h-[200px] md:h-[294px] relative mt-4 select-none">
          <Image
            src="/images/home/cars.png"
            alt="Why El Garage cars"
            fill
            className="object-contain"
          />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
