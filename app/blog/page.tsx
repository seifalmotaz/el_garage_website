"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import Image from "next/image";
import PageBanner from "@/components/common/PageBanner";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Pagination from "@/components/common/Pagination";
import ShowMoreLink from "@/components/common/ShowMoreLink";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import Link from "next/link";
import { fakePromise } from "@/lib/utils";
import NotFoundFeedback from "@/components/common/NotFoundFeedback";

// Mock articles data
export const initialArticles = [
  {
    id: 1,
    title: "إزاي تفحص سيارة مستعملة قبل الشراء؟",
    date: "9 أغسطس 2025",
    timestamp: 1754697600, // For sorting
    excerpt:
      "شراء سيارة مستعملة مغامرة تحتاج حذر شديد، لأن 70% من العربيات المستعملة في مصر بتحمل عيوب مخفية زي تصليح إطار، غرق، أو عداد معدل. التشيك ليست دي هتخليك تكشف العيوب بدري قبل ما تدفع فلوسك—من فحص الهيكل والدهان اللي بيظهر الحوادث...",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 2,
    title: "أهم 10 أسئلة لازم تسألهم قبل شراء عربية مستعملة",
    date: "8 أغسطس 2025",
    timestamp: 1754611200,
    excerpt:
      "أسئلة بتفلتر أي مخاطرة قبل ما تشتري: تاريخ الصيانة والحوادث، أسباب البيع، حالة الكيلومترات، وتكاليف الإصلاح المتوقعة—عشان قرارك يبقى مبني على معلومات مش انطباع.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 3,
    title: "كيف تبيع سيارتك المستعملة بسرعة وبأعلى سعر",
    date: "7 أغسطس 2025",
    timestamp: 1754524800,
    excerpt:
      "خطة بيع عملية من غير لف: تجهيز العربية وتصويرها صح، تسعير واقعي، كتابة إعلان مقنع، والرد على المشترين بذكاء—علشان تبيع أسرع وبسعر أفضل وبأقل مجهود.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 4,
    title: "أفضل السيارات المستعملة في مصر تحت سعر 300 ألف جنيه",
    date: "6 أغسطس 2025",
    timestamp: 1754438400,
    excerpt:
      "تبحث عن سيارة اقتصادية وموثوقة بسعر مناسب؟ جمعنا لك قائمة بأفضل السيارات المستعملة في السوق المصري تحت 300 ألف جنيه مع استهلاك بنزين موفر وتوافر قطع الغيار.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 5,
    title: "كيف تكشف تلاعب عداد الكيلومترات في السيارات المستعملة؟",
    date: "5 أغسطس 2025",
    timestamp: 1754352000,
    excerpt:
      "عداد المسافات هو أول ما ينظر إليه المشتري، لكنه للأسف الأكثر عرضة للتلاعب. إليك طرق كشف عداد السيارة الحقيقي وفحص علامات التلف داخل المقصورة.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 6,
    title: "مقارنة بين ناقل الحركة الأوتوماتيك والمانيوال: أيهما أفضل لك؟",
    date: "4 أغسطس 2025",
    timestamp: 1754265600,
    excerpt:
      "بين راحة الأوتوماتيك في الزحام وتوفير المانيوال في الوقود وصيانته السهلة، أيهما يناسب قيادتك وميزانيتك؟ قمنا بتحليل الفروق لمساعدتك في اتخاذ القرار.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 7,
    title: "علامات تلف مساعدين السيارة وكيفية فحصها بنفسك",
    date: "3 أغسطس 2025",
    timestamp: 1754179200,
    excerpt:
      "المساعدين هم المسؤولون عن ثبات السيارة وراحتها على الطريق. تعرف على أهم علامات التلف مثل تسريب الزيت أو تأرجح السيارة وطريقة فحصها البسيطة.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 8,
    title: "كيف تشتري سيارة مستعملة بالتقسيط في مصر؟",
    date: "2 أغسطس 2025",
    timestamp: 1754092800,
    excerpt:
      "دليلك الشامل لخطوات وشروط تقسيط السيارات المستعملة في البنوك والشركات المصرية، مع نصائح لحساب الفائدة والمصاريف الإدارية وتجنب التعثر.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 9,
    title: "أهم النصائح للحفاظ على موتور سيارتك في الصيف",
    date: "1 أغسطس 2025",
    timestamp: 1754006400,
    excerpt:
      "درجات الحرارة المرتفعة هي العدو الأول لمحرك السيارة. نصائح أساسية لفحص دورة التبريد، واختيار لزوجة الزيت المناسبة لحماية المحرك من السخونة.",
    image: "/assets/blog_placeholder.png",
  },
  {
    id: 10,
    title: "جدول الصيانات الدورية للسيارات: متى تغير الزيت والسيور؟",
    date: "30 يوليو 2025",
    timestamp: 1753833600,
    excerpt:
      "دليل الصيانات الوقائية لسيارتك من تغيير زيت المحرك والفرامل، وفحص سيور الكاتينة والمجموعة، إلى صيانة التكييف لضمان أطول عمر افتراضي لسيارتك.",
    image: "/assets/blog_placeholder.png",
  },
];

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

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // local input state for the search button
  const [sortBy, setSortBy] = useState("newest");
  const [filteredArticles, setFilteredArticles] = useState(initialArticles);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isPending, startTransition] = useTransition();

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const SearchSubmit = () => {
    startTransition(async () => {
      await fakePromise();
      setFilteredArticles(getFilteredArticles());
    });
  };

  useEffect(() => {
    setFilteredArticles(getFilteredArticles());
  }, [sortBy]);

  // Filter and sort articles
  const getFilteredArticles = () => {
    let result = [...initialArticles];

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.timestamp - b.timestamp);
    }

    return result;
  };

  // Featured article (always the absolute newest one from the initial list)
  const featuredArticle = initialArticles[0];

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  const paginatedArticles = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredArticles, currentPage]);

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
                <span className="v">{featuredArticle.date}</span>
              </div>

              <div className="space-y-2 mb-12.5">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] leading-tight">
                  {featuredArticle.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* Read More Link */}
              <ShowMoreLink text="اقرء المزيد" href="#" />
            </div>

            {/* Featured Image */}
            <div className="flex-1 lg:aspect-572/548 aspect-16/8 relative rounded-2xl overflow-hidden group">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                priority
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </MaxWidthWrapper>

        {/* Filter and Search Bar Section */}
        <section className=" mb-10" id="pagination-section">
          <MaxWidthWrapper>
            <div className="flex flex-col justify-between gap-8 w-full md:flex-row md:items-end">
              {/* Right side filters: Model & Sorting */}
              <div className="flex flex-row items-center sm:gap-8 gap-2 w-full md:w-auto md:flex-initial">
                {/* Model Dropdown */}
                <Dropdown
                  label="ترتيب حسب"
                  placeholder=""
                  option={sortBy}
                  options={[
                    { label: "الأقدم", value: "newest" },
                    { label: "الأحدث", value: "oldest" },
                  ]}
                  setOption={(val) => setSortBy(val)}
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                    onClick={SearchSubmit}
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
            {paginatedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedArticles.map((article) => (
                  <Link
                    href={`/blog/${article.id}`}
                    key={article.id}
                    className="bg-[#06142d] border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[420px] relative group cursor-pointer"
                  >
                    {/* Image Background */}
                    <div className="relative w-full h-full">
                      <Image
                        src={article.image}
                        alt={article.title}
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
                        <span className="text-sm leading-[21px]">
                          {article.date}
                        </span>
                      </div>

                      {/* Title & Excerpt */}
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-[20px] leading-[150%] group-hover:text-primary-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <NotFoundFeedback
                resetHandler={() => {
                  setSearchQuery("");
                  setSearchInput("");
                  setFilteredArticles(getFilteredArticles());
                }}
              />
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
