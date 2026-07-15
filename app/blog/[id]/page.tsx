"use client";

import { use, useEffect, useMemo } from "react";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import PageBanner from "@/components/common/PageBanner";
import Image from "next/image";
import { CalendarIcon } from "../page";
import { useArticleById, useArticles } from "@/hooks/useArticles";
import type { Article } from "@/lib/api/articles";
import { trackArticleView } from "@/lib/api/articles";
import { useDragClickableCards } from "@/hooks/useDragClickableCards";
import { sanitizeHtml } from "@/lib/sanitize-html";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/common/Carousel";

/**
 * Render an ISO date in the same Arabic shape the mock data used so the
 * UI is unchanged when the API is wired up.
 */
function formatArabicDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return iso;
  }
}

const RelatedBlogCard = ({
  id,
  title,
  date,
  image,
}: {
  id: string;
  title: string;
  date: string;
  image: string | null;
}) => {
  const { handleMouseDown, handleMouseMove, handleClick } =
    useDragClickableCards();

  return (
    <article
      onClick={(e) => handleClick(e, `/blog/${id}`)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      className="bg-[#06142d] border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col aspect-322/296 relative group cursor-pointer"
    >
      {/* Image Background */}
      <div className="relative w-full h-full">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />
        )}

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

  const { article, isLoading, error, mutate } = useArticleById(id);

  // Prefer same-category related articles when available.
  const { data: articlesData } = useArticles({ limit: 12, page: 1 });
  const relatedArticles: Article[] = useMemo(() => {
    const all = (articlesData?.data ?? []).filter((a) => a.id !== id);
    if (!article?.category) return all;
    const same = all.filter((a) => a.category === article.category);
    const others = all.filter((a) => a.category !== article.category);
    return [...same, ...others];
  }, [articlesData, id, article?.category]);

  const safeHtml = useMemo(
    () => (article?.content ? sanitizeHtml(article.content) : ""),
    [article?.content],
  );

  // Track one view per browser session (not on SWR revalidate of GET).
  useEffect(() => {
    if (!article?.id) return;
    void trackArticleView(article.id);
  }, [article?.id]);

  if (isLoading) {
    return (
      <main>
        <PageBanner title="المقالات/مقالة" href={`/blog/${id}`} />
        <section className="py-[78px]">
          <MaxWidthWrapper className="2xl:px-[182px]">
            <div className="space-y-4 animate-pulse">
              <div className="aspect-[1076/548] bg-gray-100 rounded-2xl" />
              <div className="p-8 space-y-4">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-10 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded" />
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main>
        <PageBanner title="المقالات/مقالة" href={`/blog/${id}`} />
        <section className="py-[78px]">
          <MaxWidthWrapper className="2xl:px-[182px]">
            <div className="flex flex-col items-center gap-4 text-center py-16">
              <h1 className="text-2xl font-bold text-gray-800">
                تعذر العثور على المقالة
              </h1>
              <p className="text-sm text-gray-500">
                {error?.message ?? "المقالة غير موجودة أو تم حذفها"}
              </p>
              <button
                onClick={() => mutate()}
                className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2.5 px-6 rounded-xl mt-2 transition-colors cursor-pointer"
              >
                حاول مرة أخرى
              </button>
            </div>
          </MaxWidthWrapper>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageBanner title="المقالات/مقالة" href={`/blog/${id}`} />

      <section className="py-[78px]">
        <MaxWidthWrapper className="2xl:px-[182px]">
          <div className="space-y-4">
            <div className="relative aspect-[1076/548] overflow-hidden rounded-2xl bg-gray-100">
              {article.image && (
                <Image src={article.image} alt={article.title} fill />
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center gap-1.5 text-sm mb-4">
                <CalendarIcon />
                <span className="v">
                  {formatArabicDate(article.publishedAt ?? article.createdAt)}
                </span>
              </div>

              <h1 className="text-[42px] leading-[100%] font-bold mb-6">
                {article.title}
              </h1>

              {article.description && (
                <p className="text-[16px] leading-[150%] text-gray-500 font-medium mb-8">
                  {article.description}
                </p>
              )}

              <div
                className="mt-8 prose prose-sm max-w-none text-gray-500 leading-[200%] [&_a]:text-primary-500 [&_img]:rounded-xl [&_img]:max-w-full"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section>
        <MaxWidthWrapper>
          <div className="mb-6">
            <h2 className="text-[24px] font-medium text-primary-800">
              مقالات ذات صلة
            </h2>
          </div>

          {relatedArticles.length === 0 ? (
            <p className="py-8 text-sm text-gray-400 text-center">
              لا توجد مقالات ذات صلة حاليًا
            </p>
          ) : (
            <Carousel dir="rtl">
              <CarouselNavigation
                className="absolute top-0 left-0 -translate-y-15"
                classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
                alwaysShow
              />
              <CarouselContent className="">
                {relatedArticles.map((art) => (
                  <CarouselItem
                    key={art.id}
                    className="2xl:basis-1/4 lg:basis-1/3 md:basis-1/2 basis-1/1 relative pl-3 last:pl-0 overflow-hidden  transition-all rounded-2xl duration-300 h-fit select-none group"
                  >
                    <RelatedBlogCard
                      id={art.id}
                      title={art.title}
                      date={formatArabicDate(
                        art.publishedAt ?? art.createdAt,
                      )}
                      image={art.image}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </MaxWidthWrapper>
      </section>
    </main>
  );
};

export default Page;