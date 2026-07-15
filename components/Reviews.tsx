"use client";

import Image from "next/image";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./common/Carousel";
import { useTestimonials } from "@/hooks/useTestimonials";

const FALLBACK_BG = "/assets/review_car_placeholder.png";

export default function Reviews() {
  const { testimonials, isLoading, error, mutate } = useTestimonials();

  return (
    <section
      id="reviews"
      className="bg-white py-16 flex flex-col items-center gap-8 w-full border-b border-gray-100"
    >
      <MaxWidthWrapper className="w-full flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
          <h2 className="text-[#0C295A] font-bold text-2xl md:text-3xl">
            اراء عملائنا
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[370px] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-gray-500">
              تعذر تحميل آراء العملاء
            </p>
            <button
              type="button"
              onClick={() => mutate()}
              className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
            >
              حاول مرة أخرى
            </button>
          </div>
        )}

        {!isLoading && !error && testimonials.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">
            لا توجد آراء حالياً
          </p>
        )}

        {!isLoading && !error && testimonials.length > 0 && (
          <Carousel dir="rtl">
            <CarouselContent className="">
              {testimonials.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="lg:basis-1/3 md:basis-1/2 basis-1/1 relative pl-3 last:pl-0 overflow-hidden transition-all rounded-2xl duration-300 min-h-[320px] md:min-h-[370px] select-none group"
                >
                  <div className="relative min-h-[320px] md:min-h-[370px] h-full px-5 py-8 rounded-2xl overflow-hidden flex flex-col justify-end shadow-sm hover:shadow-md">
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={review.bgImage || FALLBACK_BG}
                        alt={review.name}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002EC1]/90 to-transparent" />
                    </div>

                    <div className="relative z-10 text-right text-white flex flex-col gap-4">
                      <div className="flex items-start justify-start gap-3">
                        <div className="bg-[#EBF1FF] border border-white p-1.5 rounded-full relative w-11 h-11 flex items-center justify-center shrink-0 overflow-hidden">
                          {review.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-[#002EC1] font-bold text-sm">
                              {review.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <h3 className="font-bold text-base leading-tight">
                            {review.name}
                          </h3>
                          {review.carInfo && (
                            <p className="text-white/80 text-xs leading-snug line-clamp-2">
                              {review.carInfo}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-sm md:text-base font-medium leading-relaxed">
                        {review.comment}
                      </p>

                      {review.rating != null && (
                        <div className="flex items-center gap-1 justify-start">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating!
                                  ? "text-yellow-300"
                                  : "text-white/30"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </MaxWidthWrapper>
    </section>
  );
}
