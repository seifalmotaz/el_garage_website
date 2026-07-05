"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Mock articles data
const initialArticles = [
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

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // local input state for the search button
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
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
  }, [searchQuery, sortBy]);

  // Featured article (always the absolute newest one from the initial list)
  const featuredArticle = initialArticles[0];

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredArticles, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to articles grid
      const element = document.getElementById("articles-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      {/* Hero Banner Section */}
      <section className="relative w-full h-[380px] flex flex-col items-center justify-end pb-16 px-4 overflow-hidden">
        {/* Background Images and Gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero_bg.png"
            alt="Background"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Gradient overlays matching Figma's deep blue/purple hues */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001045]/95 via-[#00165b]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002853] to-[#002ec1] mix-blend-multiply opacity-80" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-[1336px] mx-auto px-6 md:px-12 flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            المقالات
          </h1>

          {/* Breadcrumbs (RTL natural alignment) */}
          <div className="flex items-center gap-1.5 text-sm text-white/70">
            <svg
              className="w-4 h-4 text-white/70 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <Link
              href="/"
              className="hover:text-white transition-colors duration-200"
            >
              الصفحة الرئيسية
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-white font-medium">المقالات</span>
          </div>
        </div>
      </section>

      {/* Main Articles Container */}
      <main className="flex-1 w-full bg-white py-12 md:py-16">
        {/* Featured Article Section */}
        <div className="max-w-[1336px] mx-auto px-6 md:px-12 mb-16">
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row items-stretch gap-6 lg:gap-12 p-6">
            {/* Featured Image */}
            <div className="flex-1 relative min-h-[260px] md:min-h-[360px] rounded-2xl overflow-hidden group">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                priority
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Featured Content (Right column in RTL) */}
            <div className="flex-1 flex flex-col justify-center items-start text-right gap-4 py-2">
              {/* Date */}
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <Image
                  src="/assets/calendar_blog.svg"
                  alt="calendar"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span>{featuredArticle.date}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {featuredArticle.title}
              </h2>

              {/* Excerpt */}
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              {/* Read More Link */}
              <Link
                href="#"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-500 font-semibold text-sm transition-all duration-200 mt-2 group"
              >
                <span className="underline underline-offset-4">
                  اقراء المزيد
                </span>
                <Image
                  src="/assets/arrow_left_blue.svg"
                  alt="read more"
                  width={20}
                  height={20}
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Section */}
        <section
          id="articles-section"
          className="max-w-[1336px] mx-auto px-6 md:px-12 mb-10"
        >
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6">
            {/* Sort Dropdown (Right side in RTL) */}
            <div className="flex flex-col gap-2 text-right">
              <label
                htmlFor="sort"
                className="text-gray-700 text-sm font-semibold px-1"
              >
                ترتيب حسب
              </label>
              <div className="relative min-w-[200px]">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl h-[48px] px-4 pl-10 text-gray-700 text-sm font-medium focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Image
                    src="/assets/chevron_down.svg"
                    alt="down"
                    width={10}
                    height={6}
                    className="opacity-70"
                  />
                </div>
              </div>
            </div>

            {/* Search Input (Left side in RTL) */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-md flex flex-col gap-2 text-right"
            >
              <label
                htmlFor="search"
                className="text-gray-700 text-sm font-semibold px-1"
              >
                البحث
              </label>
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <input
                    id="search"
                    type="text"
                    placeholder="ابحث عن مقال..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl h-[48px] pr-11 pl-4 text-gray-700 text-sm focus:outline-none focus:border-primary-500 placeholder-gray-400"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Image
                      src="/assets/search_normal.svg"
                      alt="search"
                      width={18}
                      height={18}
                      className="opacity-60"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-6 rounded-xl transition-colors duration-200 shadow-sm"
                >
                  بحث
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="max-w-[1336px] mx-auto px-6 md:px-12 mb-12">
          {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article) => (
                <div
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
                    <div className="flex items-center justify-start gap-1.5 opacity-80 text-xs">
                      <Image
                        src="/assets/calendar_blog.svg"
                        alt="calendar"
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 invert"
                      />
                      <span>{article.date}</span>
                    </div>

                    {/* Title & Excerpt */}
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-lg leading-snug group-hover:text-primary-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-16 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 text-lg">
                لم يتم العثور على أي مقالات تطابق بحثك.
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchInput("");
                  }}
                  className="mt-4 text-primary-500 font-semibold underline underline-offset-4 hover:text-primary-600 transition-colors"
                >
                  إعادة تعيين البحث
                </button>
              )}
            </div>
          )}
        </section>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <section className="max-w-[1336px] mx-auto px-6 md:px-12 flex justify-center mt-12">
            <div className="flex items-center gap-3 select-none">
              {/* Next Page Arrow (RTL direction - so left arrow is next) */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
              >
                <Image
                  src="/assets/arrow_left_gray.svg"
                  alt="next"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </button>

              {/* Numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const isActive = currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Previous Page Arrow (RTL direction - so right arrow is prev) */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
              >
                <Image
                  src="/assets/arrow_left_gray.svg"
                  alt="prev"
                  width={16}
                  height={16}
                  className="w-4 h-4 rotate-180"
                />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
