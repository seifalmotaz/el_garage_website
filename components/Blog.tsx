"use client";

import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import { useArticles } from "@/hooks/useArticles";
import type { Article } from "@/lib/api/articles";

/**
 * Layout spans for the three teaser cards. The first card is the
 * "featured" card and takes 2 of the 4 grid columns, the other two fill
 * the remaining space. Keep the array length and order in sync with
 * `TEASER_LIMIT`.
 */
const TEASER_SPANS = [
  "lg:col-span-2 md:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
] as const;

/** Number of articles requested for the home teaser. */
const TEASER_LIMIT = 3;

/**
 * Render an ISO date string in the same `9 أغسطس 2025` Arabic shape the
 * mock data used so the UI looks unchanged when the API is wired up.
 * Falls back to the raw ISO string if the browser locale data is
 * unavailable.
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

function BlogCard({
  article,
  span,
  index,
}: {
  article: Article;
  span: string;
  index: number;
}) {
  return (
    <Link
      href={`/blog/${article.id}`}
      className={`bg-[#06142d] border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[480px] relative group cursor-pointer ${span}`}
    >
      {/* Blog Image */}
      <div className="relative w-full h-full">
        {index !== 1 && article.image && (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />
        )}

        {/* Grid layout vectors overlay for card 2 */}
        {index === 1 && (
          <div className="absolute inset-0 z-10 opacity-40 pointer-events-none mix-blend-overlay">
            <Image
              src="/assets/blog_pattern.svg"
              alt="pattern"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Blog Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 z-20 text-right text-white">
        {/* Date */}
        <div className="flex items-center justify-start gap-1.5 opacity-80">
          <Image
            src="/assets/calendar_blog.svg"
            alt="calendar"
            width={14}
            height={14}
            className="w-3.5 h-3.5"
          />
          <span className="text-xs font-light font-mono">
            {formatArabicDate(article.publishedAt ?? article.createdAt)}
          </span>
        </div>

        {/* Title and Description */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg leading-snug group-hover:text-primary-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-2">
            {article.description ?? ""}
          </p>
        </div>
      </div>
    </Link>
  );
}

function BlogSkeleton() {
  return (
    <>
      {TEASER_SPANS.map((span, i) => (
        <div
          key={i}
          className={`bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden flex flex-col h-[480px] relative animate-pulse ${span}`}
        >
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function Blog() {
  const { data, isLoading, error, mutate } = useArticles({
    limit: TEASER_LIMIT,
    page: 1,
  });

  const articles = data?.data ?? [];

  return (
    <section
      id="blog"
      className="bg-white lg:py-13 py-8 flex flex-col items-center gap-8 w-full border-b border-gray-100"
    >
      <MaxWidthWrapper className="w-full flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
          <h2 className="text-primary-800 font-medium text-2xl md:text-3xl">
            مقالات تهمك
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-gray-500 hover:text-primary-500 cursor-pointer transition-colors group"
          >
            <span className="text-sm font-semibold">عرض المزيد</span>
            <Image
              src="/assets/arrow_left_gray.svg"
              alt="show more"
              width={16}
              height={16}
              className="w-4.5 h-4.5 group-hover:translate-x-[-4px] transition-transform"
            />
          </Link>
        </div>

        {/* Blog Posts Grid */}
        {isLoading && articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
            <BlogSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-red-600">تعذر تحميل المقالات</p>
            <button
              onClick={() => mutate()}
              className="text-sm font-semibold text-primary-500 hover:text-primary-600 cursor-pointer"
            >
              حاول مرة أخرى
            </button>
          </div>
        ) : articles.length === 0 ? (
          <p className="py-12 text-sm text-gray-400 text-center">
            لا توجد مقالات حاليًا
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
            {articles.slice(0, TEASER_LIMIT).map((article, idx) => (
              <BlogCard
                key={article.id}
                article={article}
                span={TEASER_SPANS[idx] ?? "lg:col-span-1"}
                index={idx}
              />
            ))}
          </div>
        )}
      </MaxWidthWrapper>
    </section>
  );
}