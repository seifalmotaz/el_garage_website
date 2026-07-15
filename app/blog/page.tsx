"use client";

import { useState, useMemo, useTransition } from "react";
import Image from "next/image";
import PageBanner from "@/components/common/PageBanner";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Pagination from "@/components/common/Pagination";
import ShowMoreLink from "@/components/common/ShowMoreLink";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Link from "next/link";
import NotFoundFeedback from "@/components/common/NotFoundFeedback";
import { useArticles } from "@/hooks/useArticles";
import type { Article } from "@/lib/api/articles";

export const CalendarIcon = ({ color = "#1A1A1A" }: { color?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.33398 1.3335V3.3335"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.666 1.3335V3.3335"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.33398 6.06006H13.6673"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 5.66683V11.3335C14 13.3335 13 14.6668 10.6667 14.6668H5.33333C3 14.6668 2 13.3335 2 11.3335V5.66683C2 3.66683 3 2.3335 5.33333 2.3335H10.6667C13 2.3335 14 3.66683 14 5.66683Z"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4625 9.13314H10.4685"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4625 11.1331H10.4685"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99764 9.13314H8.00363"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99764 11.1331H8.00363"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.52889 9.13314H5.53488"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.52889 11.1331H5.53488"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Number of articles per page on the listing. */
const ITEMS_PER_PAGE = 9;

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

type SortKey = "newest" | "oldest";

/**
 * Map the local sort key to a backend-compatible sort signal. Since the
 * public articles endpoint returns paginated data ordered by recency
 * by default, "oldest" simply inverts the client-side array.
 */
function sortArticles(articles: Article[], sort: SortKey): Article[] {
  // The backend already returns newest-first; for "oldest" we flip it.
  if (sort === "oldest") return [...articles].reverse();
  return articles;
}

export default function BlogPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [isPending, startTransition] = useTransition();

  const { data, isLoading, error, mutate } = useArticles({
    limit: 100, // fetch a large page so client-side search/sort covers a realistic window
    page: 1,
    search: searchQuery || undefined,
  });

  const allArticles = data?.data ?? [];
  const sortedArticles = useMemo(
    () => sortArticles(allArticles, sortBy),
    [allArticles, sortBy],
  );

  // Server returns up to 100 most recent (filtered by search). Paginate
  // client-side so we don't refetch on every page flip.
  const totalPages = Math.max(
    1,
    Math.ceil(sortedArticles.length / ITEMS_PER_PAGE),
  );

  const paginatedArticles = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedArticles.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedArticles, currentPage]);

  // Featured article — first item from the unfiltered list, or null while
  // loading. We always show the most-recently-published article as the
  // featured one regardless of the active search filter.
  const featuredArticle = allArticles[0] ?? null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    startTransition(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    });
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      {/* Hero Banner Section */}
      <PageBanner title="المقالات" href="/blog" />
      {/* Main Articles Container */}
      <main className="flex-1 w-full bg-white py-12 md:py-16">
        {/* Featured Article Section */}
        <MaxWidthWrapper className=" mb-16">
          <div className="overflow-hidden transition-all duration-300 flex flex-col lg:flex-row items-stretch gap-6 lg:gap-12">
            {/* Featured Content (Right column in RTL) */}
            <div className="flex-1 flex flex-col justify-center items-start text-right py-2">
              {/* Date */}
              <div className="flex items-center gap-1.5 text-sm mb-4">
                <CalendarIcon />
                <span className="v">
                  {featuredArticle
                    ? formatArabicDate(
                        featuredArticle.publishedAt ?? featuredArticle.createdAt,
                      )
                    : "—"}
                </span>
              </div>

              <div className="space-y-2 mb-12.5">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] leading-tight">
                  {featuredArticle?.title ?? "جاري تحميل المقالات..."}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  {featuredArticle?.description ?? ""}
                </p>
              </div>

              {/* Read More Link */}
              {featuredArticle && (
                <ShowMoreLink
                  text="اقرء المزيد"
                  href={`/blog/${featuredArticle.id}`}
                />
              )}
            </div>

            {/* Featured Image */}
            <div className="flex-1 lg:aspect-572/548 aspect-16/8 relative rounded-2xl overflow-hidden group bg-gray-100">
              {featuredArticle?.image ? (
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
              ) : null}
            </div>
          </div>
        </MaxWidthWrapper>

        {/* Filter and Search Bar Section */}
        <section className=" mb-10" id="pagination-section">
          <MaxWidthWrapper>
            <div className="flex flex-col justify-between gap-8 w-full md:flex-row md:items-end">
              {/* Right side filters: Model & Sorting */}
              <div className="flex flex-row items-center sm:gap-8 gap-2 w-full md:w-auto md:flex-initial">
                {/* Sort Dropdown */}
                <Dropdown
                  label="ترتيب حسب"
                  placeholder=""
                  option={sortBy}
                  options={[
                    { label: "الأحدث", value: "newest" },
                    { label: "الأقدم", value: "oldest" },
                  ]}
                  setOption={(val) => {
                    setSortBy(val as SortKey);
                    setCurrentPage(1);
                  }}
                  className={"md:w-[282px]"}
                  variant="white"
                />
              </div>

              {/* Left side: Search input */}
              <div className={"flex flex-col gap-2 text-right w-full flex-1"}>
                <label className="text-gray-900 text-sm px-1 leading-[100%]">
                  البحث
                </label>
                <div className="flex gap-2 w-full">
                  <div className="relative flex-1 bg-white border border-gray-200 rounded-xl h-[50px] flex items-center justify-between px-3">
                    <input
                      type="text"
                      placeholder="بتدور على ايه !"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchSubmit();
                      }}
                      className="w-full h-full text-right outline-none text-xs pr-7 font-light text-gray-800"
                    />
                    <Image
                      src="/assets/search_normal.svg"
                      alt="search"
                      width={18}
                      height={18}
                      className="absolute right-3 opacity-50"
                    />
                  </div>
                  <Button
                    isLoading={isPending}
                    disabled={isPending}
                    onClick={() => handleSearchSubmit()}
                    spinnerVariant={"primary"}
                    className="bg-white border border-gray-200 hover:bg-primary-50 text-primary-500 font-semibold w-[120px]"
                  >
                    بحث
                  </Button>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>

        {/* Articles Grid */}
        <section className="mb-12">
          <MaxWidthWrapper>
            {error ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-red-600">
                  تعذر تحميل المقالات
                </p>
                <button
                  onClick={() => mutate()}
                  className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2.5 px-6 rounded-xl mt-2 transition-colors cursor-pointer"
                >
                  حاول مرة أخرى
                </button>
              </div>
            ) : isLoading && paginatedArticles.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden flex flex-col h-[420px] relative animate-pulse"
                  />
                ))}
              </div>
            ) : paginatedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedArticles.map((article) => (
                  <Link
                    href={`/blog/${article.id}`}
                    key={article.id}
                    className="bg-[#06142d] border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[420px] relative group cursor-pointer"
                  >
                    {/* Image Background */}
                    <div className="relative w-full h-full">
                      {article.image && (
                        <Image
                          src={article.image}
                          alt={article.title}
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
                        <span className="text-sm leading-[21px]">
                          {formatArabicDate(
                            article.publishedAt ?? article.createdAt,
                          )}
                        </span>
                      </div>

                      {/* Title & Excerpt */}
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-[20px] leading-[150%] group-hover:text-primary-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-2">
                          {article.description ?? ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <NotFoundFeedback resetHandler={handleReset} />
            )}
          </MaxWidthWrapper>
        </section>

        {/* Pagination Section */}
        <Pagination
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          activePage={currentPage > totalPages ? 1 : currentPage}
        />
      </main>
    </div>
  );
}