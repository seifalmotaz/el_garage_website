import Link from "next/link";
import Image from "next/image";

const PageBanner = ({
  title,
  href,
  image = "/images/car-details/banner.png",
}: {
  title: string;
  href: string;
  image?: string;
}) => {
  const titles = title.split("/"); // example: ["المقالات", "مقالة"]
  const hrefParts = href.split("/").filter(Boolean); // example: ["blog", "slug"]

  // build incremental paths
  const paths = hrefParts.map(
    (_, i) => "/" + hrefParts.slice(0, i + 1).join("/"),
  );

  return (
    <div className="relative w-full lg:h-[427px] h-[375px] overflow-hidden flex flex-col justify-end text-center pb-8 md:pb-0">
      <Image
        src={image}
        alt="banner"
        fill
        className="object-cover object-center"
        priority
      />

      <div
        className="relative z-20 flex flex-col gap-3 px-6 lg:pb-[112px] pb-[44px]"
        dir="rtl"
      >
        <h1 className="lg:text-3xl md:text-[38px] text-lg text-white">
          {titles[titles.length - 1]}
        </h1>

        <div className="flex items-center justify-center sm:gap-2 gap-1 text-xs md:text-sm text-gray-300 font-medium">
          {/* Home */}
          <Link
            href="/"
            className="hover:text-white transition-colors flex gap-2 items-center"
          >
            <Image src="/icons/home-2.svg" alt="home" width={24} height={24} />
            الصفحة الرئيسية
          </Link>

          {/* Dynamic breadcrumbs */}

          {titles.map((t, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-gray-500">/</span>
              <Link
                href={paths[i] || "#"}
                className="hover:text-white transition-colors"
              >
                {t}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
