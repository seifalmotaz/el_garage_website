"use client";

import { use } from "react";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import PageBanner from "@/components/common/PageBanner";
import Image from "next/image";
import { CalendarIcon, initialArticles } from "../page";
import { useDragClickableCards } from "@/hooks/useDragClickableCards";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/common/Carousel";

const RelatedBlogCard = ({
  id,
  title,
  date,
  image,
}: {
  id: number;
  title: string;
  date: string;
  image: string;
}) => {
  const { handleMouseDown, handleMouseMove, handleClick } =
    useDragClickableCards();

  return (
    <article
      onClick={(e) => handleClick(e, `/blog/${id + 1}`)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      className="bg-[#06142d] border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col aspect-322/296 relative group cursor-pointer"
    >
      {/* Image Background */}
      <div className="relative w-full h-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Shadow overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06142d] via-[#06142d]/60 to-transparent z-10" />
      </div>

      {/* Text Overlay Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3 z-20 text-right text-white">
        {/* Date */}
        <div className="flex items-center justify-start gap-1.5 opacity-80">
          <CalendarIcon color="white" />
          <span className="text-sm leading-[21px]">{date}</span>
        </div>

        <div>
          {/* Title & Excerpt */}
          <h3 className="font-semibold text-[20px] leading-[150%] group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </article>
  );
};

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params); // ✅ unwrap the promise

  const article = initialArticles.find((item) => item.id === +id);

  return (
    <main>
      <PageBanner title="المقالات/مقالة" href={`/blog/${id}`} />

      <section className="py-[78px]">
        <MaxWidthWrapper className="2xl:px-[182px]">
          {article !== undefined ? (
            <div className="space-y-4">
              <div className="relative aspect-[1076/548] overflow-hidden rounded-2xl">
                <Image
                  src="/assets/blog_placeholder.png"
                  alt="blog image"
                  fill
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-1.5 text-sm mb-4">
                  <CalendarIcon />
                  <span className="v">{article.date}</span>
                </div>

                <h1 className="text-[42px] leading-[100%] font-bold mb-6">
                  {article.title}
                </h1>

                <p className="text-[16px] leading-[150%] text-gray-500 font-medium">
                  {article.excerpt}
                </p>

                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-[20px] text-gray-600 font-bold">
                      الفحص الخارجي: ابدأ من الشكل العام
                    </h2>
                    <p className="text-sm text-gray-500">
                      الفجوات بين الأبواب والكابوت متساوية؟ لو لأ = تصليح إطار.
                      خدوش تحت المرايا أو دهان جديد حول المصابيح؟ = خبط حديث.
                      صدأ تحت السيارة أو في عتبات الأبواب؟ رطوبة وغرق. الإطارات
                      نفس الماركة والتآكل متساوي؟
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-[20px] text-gray-600 font-bold">
                      الفحص الخارجي: ابدأ من الشكل العام
                    </h2>
                    <p className="text-sm text-gray-500">
                      الفجوات بين الأبواب والكابوت متساوية؟ لو لأ = تصليح إطار.
                      خدوش تحت المرايا أو دهان جديد حول المصابيح؟ = خبط حديث.
                      صدأ تحت السيارة أو في عتبات الأبواب؟ رطوبة وغرق. الإطارات
                      نفس الماركة والتآكل متساوي؟
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-[20px] text-gray-600 font-bold">
                      الفحص الخارجي: ابدأ من الشكل العام
                    </h2>
                    <p className="text-sm text-gray-500">
                      الفجوات بين الأبواب والكابوت متساوية؟ لو لأ = تصليح إطار.
                      خدوش تحت المرايا أو دهان جديد حول المصابيح؟ = خبط حديث.
                      صدأ تحت السيارة أو في عتبات الأبواب؟ رطوبة وغرق. الإطارات
                      نفس الماركة والتآكل متساوي؟
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-[20px] text-gray-600 font-bold">
                      الفحص الخارجي: ابدأ من الشكل العام
                    </h2>
                    <p className="text-sm text-gray-500">
                      الفجوات بين الأبواب والكابوت متساوية؟ لو لأ = تصليح إطار.
                      خدوش تحت المرايا أو دهان جديد حول المصابيح؟ = خبط حديث.
                      صدأ تحت السيارة أو في عتبات الأبواب؟ رطوبة وغرق. الإطارات
                      نفس الماركة والتآكل متساوي؟
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h1>not found</h1>
          )}
        </MaxWidthWrapper>
      </section>

      <section>
        <MaxWidthWrapper>
          <div className="mb-6">
            <h2 className="text-[24px] font-medium text-primary-800">
              مقالات ذات صلة
            </h2>
          </div>

          <Carousel dir="rtl">
            <CarouselNavigation
              className="absolute top-0 left-0 -translate-y-15"
              classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
              alwaysShow
            />
            <CarouselContent className="">
              {initialArticles.map((art, idx) => (
                <CarouselItem
                  key={idx}
                  className="2xl:basis-1/4 lg:basis-1/3 md:basis-1/2 basis-1/1 relative pl-3 last:pl-0 overflow-hidden  transition-all rounded-2xl duration-300 h-fit select-none group"
                >
                  <RelatedBlogCard key={idx} {...art} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </MaxWidthWrapper>
      </section>
    </main>
  );
};

export default Page;
