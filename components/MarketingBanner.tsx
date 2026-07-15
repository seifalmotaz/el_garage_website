"use client";

import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import { useBanners } from "@/hooks/useBanners";
import { BANNER_POSITION } from "@/lib/api/banners";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./common/Carousel";

/** Website marketing banners (position = 2). Hidden when empty (after load). */
export default function MarketingBanner() {
  const { banners, isLoading } = useBanners({
    position: BANNER_POSITION.WEB,
    limit: 5,
  });

  if (isLoading) {
    return (
      <section className="w-full py-8 md:py-12 bg-white" aria-hidden>
        <MaxWidthWrapper className="w-full">
          <div className="w-full min-h-[160px] md:min-h-[220px] rounded-2xl md:rounded-3xl bg-gray-100 animate-pulse" />
        </MaxWidthWrapper>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 md:py-12 bg-white">
      <MaxWidthWrapper className="w-full">
        {banners.length === 1 ? (
          <BannerSlide banner={banners[0]} />
        ) : (
          <Carousel dir="rtl">
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id} className="basis-full pl-0">
                  <BannerSlide banner={banner} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </MaxWidthWrapper>
    </section>
  );
}

function BannerSlide({
  banner,
}: {
  banner: {
    id: string;
    title: string;
    subtitle?: string | null;
    image: string | null;
    link: string | null;
  };
}) {
  const content = (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl min-h-[160px] md:min-h-[220px] bg-[#06142d] group">
      {banner.image && (
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          className="object-cover group-hover:scale-102 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#002EC1]/80 via-[#002EC1]/30 to-transparent" />
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[160px] md:min-h-[220px] p-6 md:p-10 text-white text-right">
        <h3 className="text-xl md:text-3xl font-bold">{banner.title}</h3>
        {banner.subtitle && (
          <p className="mt-2 text-sm md:text-base text-white/90 max-w-xl">
            {banner.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (banner.link) {
    const isExternal = /^https?:\/\//i.test(banner.link);
    if (isExternal) {
      return (
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={banner.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
