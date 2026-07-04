import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./common/MaxWidthWrapper";

export default function Blog() {
  const posts = [
    {
      title: "إزاي تفحص سيارة مستعملة قبل الشراء؟",
      date: "9 أغسطس 2025",
      description:
        "تشيك ليست سريعة ومنظمة خطوة بخطوة: من الهيكل والدهان، للموتور والعفشة، لحد تجربة القيادة ومراجعة الورق—عشان تكشف العيوب بدري وتتفاوض وأنت مطمّن.",
      image: "/assets/blog_placeholder.png",
      span: "lg:col-span-2 md:col-span-2",
    },
    {
      title: "أهم 10 أسئلة لازم تسألهم قبل شراء عربية مستعملة",
      date: "9 أغسطس 2025",
      description:
        "أسئلة بتفلتر أي مخاطرة قبل ما تشتري: تاريخ الصيانة والحوادث، أسباب البيع، حالة الكيلومترات، وتكاليف الإصلاح المتوقعة—عشان قرارك يبقى مبني على معلومات مش انطباع.",
      image: "/assets/blog_placeholder.png",
      span: "lg:col-span-1",
    },
    {
      title: "كيف تبيع سيارتك المستعملة بسرعة وبأعلى سعر",
      date: "9 أغسطس 2025",
      description:
        "خطة بيع عملية من غير لف: تجهيز العربية وتصويرها صح، تسعير واقعي، كتابة إعلان مقنع، والرد على المشترين بذكاء—علشان تبيع أسرع وبسعر أفضل وبأقل مجهود.",
      image: "/assets/blog_placeholder.png",
      span: "lg:col-span-1",
    },
  ];

  return (
    <section
      id="blog"
      className="bg-white py-16 flex flex-col items-center gap-8 w-full border-b border-gray-100"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className={`bg-[#06142d] border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[480px] relative group cursor-pointer ${post.span}`}
            >
              {/* Blog Image */}
              <div className="relative w-full h-full">
                {idx !== 1 && post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                )}

                {/* Background Shadow Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-[#06142d]/90 via-[#06142d]/50 to-transparent z-10" /> */}

                {/* Grid layout vectors overlay for card 2 */}
                {idx === 1 && (
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
                    {post.date}
                  </span>
                </div>

                {/* Title and Description */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg leading-snug group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
