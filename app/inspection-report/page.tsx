"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import PageBanner from "@/components/common/PageBanner";
import Button from "@/components/common/Button";
import { useCar } from "@/hooks/useCar";
import { useActiveInspectionVersion } from "@/hooks/useActiveInspectionVersion";
import { absolutizeUrl } from "@/lib/api/media";
import { formatMileage, formatPrice } from "@/lib/format";
import {
  resolveInspectionSemanticType,
  type InspectionAnswerOption,
} from "@/lib/inspection-semantics";
import type {
  CarDetail,
  CarInspectionPhoto,
  InspectionReportResponse,
} from "@/lib/api/types";

/**
 * Status enum expected by the existing JSX counters, filter chips, and
 * per-question colour swatches. The backend's `answerValue` already uses
 * the same `GOOD | WARN | BAD` literals, so this is a direct passthrough
 * after a defensive normalisation.
 */
type ReportStatus = "GOOD" | "WARN" | "BAD";

/**
 * Internal shape consumed by the existing JSX. We rebuild this from the
 * API's flat `responses[]` so the markup below stays unchanged.
 */
type ReportQuestion = {
  id: string;
  label: string;
  desc: string;
  status: ReportStatus;
  notes: string;
};

type ReportPhoto = {
  url: string;
  description: string;
};

type ReportSection = {
  id: string;
  title: string;
  iconSrc: string;
  questions: ReportQuestion[];
  photos: ReportPhoto[];
  sectionNote?: string;
};

/**
 * Map the backend's free-form Arabic section title to the stable
 * section-id keys the navigation tabs and `sectionRefs` already use.
 * Sections whose title isn't in the table keep a slugified version so
 * the scroll-to-section logic still works for new section types.
 */
const SECTION_ID_BY_TITLE: Record<string, string> = {
  "تفاصيل السيارة": "details",
  "الهيكل الخارجي": "exterior",
  "نظام الفرامل": "brakes",
  "المحرك والحركة": "engine",
  "المحرك ونظام الحركة": "engine",
  "المقصورة الداخلية": "interior",
};

/**
 * Pick a local icon path for an inspection section title — same mapping
 * as the car-details sidebar so the two surfaces stay visually aligned.
 */
function sectionIconSrc(title: string, sectionIcon: string | null): string {
  const t = title.toLowerCase();
  if (sectionIcon) {
    const code = sectionIcon.toLowerCase();
    if (code.includes("engine") || code.includes("motor"))
      return "/icons/engine.svg";
    if (
      code.includes("brake") ||
      code.includes("wheel") ||
      code.includes("tire")
    )
      return "/icons/wheel.svg";
    if (code.includes("road")) return "/icons/road-test.svg";
    if (
      code.includes("electronic") ||
      code.includes("obd") ||
      code.includes("file")
    )
      return "/icons/file-check.svg";
    if (
      code.includes("repair") ||
      code.includes("scratch") ||
      code.includes("defect")
    )
      return "/icons/car-repair.svg";
    if (code.includes("body") || code.includes("car")) return "/icons/car.svg";
  }
  if (t.includes("محرك") || t.includes("ناقل")) return "/icons/engine.svg";
  if (t.includes("فرامل") || t.includes("إطار") || t.includes("اطار"))
    return "/icons/wheel.svg";
  if (t.includes("طريق") || t.includes("قيادة")) return "/icons/road-test.svg";
  if (t.includes("إلكترون") || t.includes("الكترون") || t.includes("كمبيوتر"))
    return "/icons/file-check.svg";
  if (t.includes("خدش") || t.includes("عيب") || t.includes("داخل"))
    return "/icons/car-repair.svg";
  if (t.includes("هيكل") || t.includes("خارج")) return "/icons/car.svg";
  return "/icons/car.svg";
}

/**
 * Slugify an arbitrary Arabic section title into a URL-safe id.
 * Used when the backend introduces a new section the page hasn't seen
 * before; keeps the `sectionRefs`/scroll anchors working.
 */
function slugifySectionTitle(title: string): string {
  const slug = title
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9_]/g, "");
  return slug || "section";
}

/** Dashboard-compatible status resolution via option catalog / legacy map. */
function normaliseStatus(
  response: {
    answerValue: string;
    answerText?: string | null;
    questionKey?: string | null;
    semanticType?: "GOOD" | "WARN" | "BAD";
  },
  catalog?: Map<string, InspectionAnswerOption[]>,
): ReportStatus {
  return resolveInspectionSemanticType({
    answerValue: response.answerValue,
    answerText: response.answerText,
    questionKey: response.questionKey,
    semanticType: response.semanticType,
    catalog,
  });
}

/**
 * Format the ISO `completedAt` string as a short Arabic-friendly date.
 * Returns `"—"` when the report is still in progress (matches the
 * nullable contract on `InspectionReportResponse.completedAt`).
 */
function formatReportDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Group the flat response list from `InspectionReportResponse` into the
 * section-accordion shape the JSX consumes. Responses with no `section`
 * field are pushed into a synthetic `_unsectioned` bucket so they are
 * still rendered instead of being silently dropped.
 */
function buildSections(
  report: InspectionReportResponse,
  photos: CarInspectionPhoto[],
  catalog?: Map<string, InspectionAnswerOption[]>,
): ReportSection[] {
  const groups = new Map<
    string,
    {
      title: string;
      icon: string | null;
      order: number;
      questions: ReportQuestion[];
    }
  >();

  for (const response of report.responses) {
    const title = response.section ?? "_unsectioned";
    if (!groups.has(title)) {
      groups.set(title, {
        title,
        icon: response.sectionIcon,
        order: response.sectionOrder ?? 999,
        questions: [],
      });
    }
    const group = groups.get(title)!;
    if (
      response.sectionOrder !== undefined &&
      response.sectionOrder < group.order
    ) {
      group.order = response.sectionOrder;
    }
    group.questions.push({
      id: response.id,
      label: response.questionText,
      desc: response.questionKey,
      status: normaliseStatus(response, catalog),
      notes: response.notes ?? response.answerText ?? "",
    });
  }

  // Distribute photos to sections in the order the sections appear.
  // The backend's `inspectionPhotos` carry a `sectionId` UUID that we
  // can't reliably join back to the response titles, so we group by
  // first-seen sectionId and assign groups to sections positionally.
  // Photos with no `sectionId` form their own leading group that goes
  // to the first section (typically the vehicle-info "details" group).
  const photoGroups: CarInspectionPhoto[][] = [];
  const seenSectionIds = new Map<string, number>();
  for (const photo of photos) {
    let idx: number;
    if (photo.sectionId == null) {
      idx = 0;
      if (!photoGroups[idx]) photoGroups[idx] = [];
    } else {
      if (!seenSectionIds.has(photo.sectionId)) {
        seenSectionIds.set(photo.sectionId, photoGroups.length);
        photoGroups.push([]);
      }
      idx = seenSectionIds.get(photo.sectionId)!;
    }
    photoGroups[idx].push(photo);
  }

  let photoCursor = 0;
  return Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .map((group) => {
      const id =
        SECTION_ID_BY_TITLE[group.title] ?? slugifySectionTitle(group.title);
      const iconSrc = sectionIconSrc(group.title, group.icon);
      const sectionPhotos: ReportPhoto[] = [];
      if (photoGroups.length > 0) {
        const assigned = photoGroups[photoCursor % photoGroups.length] ?? [];
        for (const photo of assigned) {
          const url = absolutizeUrl(photo.url);
          if (!url) continue;
          sectionPhotos.push({
            url,
            description: photo.description ?? "",
          });
        }
        photoCursor += 1;
      }
      return {
        id,
        title: group.title === "_unsectioned" ? "أخرى" : group.title,
        iconSrc,
        questions: group.questions,
        photos: sectionPhotos,
      };
    });
}

/**
 * Project a `CarDetail` into the page's view-model shape. Pulled out so
 * the `useMemo` dependency stays a stable reference and so the JSX can
 * read plain strings rather than digging into nested API fields.
 */
function buildViewModel(
  car: CarDetail,
  catalog?: Map<string, InspectionAnswerOption[]>,
) {
  const heroImage =
    absolutizeUrl(car.images[0]) ?? "/assets/car_placeholder.png";
  const brand = car.carBrand?.name ?? car.brand;
  const model = car.carModel?.name ?? car.model;
  const report = car.inspectionReport ?? null;
  const sections = report
    ? buildSections(report, car.inspectionPhotos, catalog)
    : [];
  return {
    reportId: report?.id ?? car.id,
    reportNumber: report?.id.slice(0, 8).toUpperCase() ?? "—",
    reportDate: formatReportDate(report?.completedAt ?? null),
    brand,
    model,
    year: car.year,
    mileage: car.mileage,
    price: car.price,
    heroImage,
    carId: car.id,
    sections,
    hasReport: report !== null && report !== undefined,
  };
}

function StatusIcon({ status }: { status: ReportStatus }) {
  if (status === "GOOD") {
    return (
      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[11px] font-bold shrink-0">
        ✓
      </span>
    );
  }
  if (status === "WARN") {
    return (
      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-[11px] font-bold shrink-0">
        !
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[11px] font-bold shrink-0">
      ✕
    </span>
  );
}

function statusLabel(status: ReportStatus): string {
  if (status === "GOOD") return "سليم";
  if (status === "WARN") return "تنبيه";
  return "تالف";
}

function statusTextClass(status: ReportStatus): string {
  if (status === "GOOD") return "text-green-600";
  if (status === "WARN") return "text-orange-500";
  return "text-red-600";
}

function statusCardClass(status: ReportStatus): string {
  if (status === "GOOD") return "border-green-100 bg-green-50/30";
  if (status === "WARN") return "border-orange-100 bg-orange-50/30";
  return "border-red-100 bg-red-50/30";
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-[50vh] bg-gray-50">
      <PageBanner title="تقرير الفحص الفني" href="/inspection-report" />
      <main className="flex-1 flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-1">
          <Image
            src="/icons/report.svg"
            alt=""
            width={28}
            height={28}
            className="opacity-70"
          />
        </div>
        <p className="text-gray-800 font-bold text-lg">{title}</p>
        <p className="text-gray-500 text-sm max-w-md leading-relaxed">
          {description}
        </p>
        {action}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="relative flex flex-col min-h-[50vh] bg-gray-50">
      <PageBanner title="تقرير الفحص الفني" href="/inspection-report" />
      <main className="flex-1 flex items-center justify-center py-24">
        <span className="spinner border-primary-500! border-b-transparent!" />
      </main>
    </div>
  );
}

/**
 * Inner component: owns the search-params + data hooks. Wrapped in a
 * `<Suspense>` boundary by the outer page so Next.js can prerender the
 * rest of the route during the production build (the
 * `useSearchParams` API docs require this).
 */
function InspectionReportInner() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const { car, isLoading, error, mutate } = useCar(carId);
  const { catalog: inspectionCatalog } = useActiveInspectionVersion();

  const [filter, setFilter] = useState<"ALL" | ReportStatus>("ALL");
  const [activeSection, setActiveSection] = useState("");
  const [copied, setCopied] = useState(false);

  const viewModel = useMemo(
    () => (car ? buildViewModel(car, inspectionCatalog) : null),
    [car, inspectionCatalog],
  );

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (viewModel?.sections[0]?.id) {
      setActiveSection(viewModel.sections[0].id);
    }
  }, [viewModel?.sections]);

  // Highlight the section currently in view while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const [sectionId, ref] of Object.entries(sectionRefs.current)) {
        if (!ref) continue;
        const offsetTop = ref.offsetTop;
        const offsetHeight = ref.offsetHeight;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(sectionId);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allQuestions = viewModel?.sections.flatMap((s) => s.questions) ?? [];
  const totalQuestions = allQuestions.length;
  const goodCount = allQuestions.filter((q) => q.status === "GOOD").length;
  const warnCount = allQuestions.filter((q) => q.status === "WARN").length;
  const badCount = allQuestions.filter((q) => q.status === "BAD").length;
  const passedRate =
    totalQuestions === 0 ? 0 : Math.round((goodCount / totalQuestions) * 100);

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref) {
      const top =
        ref.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const filterQuestion = (status: ReportStatus) => {
    if (filter === "ALL") return true;
    return status === filter;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard permission
      setCopied(false);
    }
  };

  // ===== Loading / error / empty guards ===== //
  if (!carId) {
    return (
      <EmptyState
        title="لم يتم تحديد سيارة"
        description="يرجى فتح التقرير عبر رابط السيارة من صفحة التفاصيل."
        action={
          <Link
            href="/cars"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition-colors"
          >
            تصفح السيارات
          </Link>
        }
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyState
        title="حدث خطأ أثناء تحميل التقرير"
        description="تعذّر جلب بيانات تقرير الفحص. حاول مرة أخرى."
        action={
          <button
            type="button"
            onClick={() => mutate()}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition-colors"
          >
            حاول مرة أخرى
          </button>
        }
      />
    );
  }

  if (!car || !viewModel) {
    return (
      <EmptyState
        title="السيارة غير موجودة"
        description="ربما تكون قد انتهت صلاحية الإعلان أو تم حذفه."
        action={
          <Link
            href="/cars"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition-colors"
          >
            تصفح السيارات
          </Link>
        }
      />
    );
  }

  if (!viewModel.hasReport || viewModel.sections.length === 0) {
    return (
      <EmptyState
        title="لا يوجد تقرير فحص لهذه السيارة"
        description="تقرير الفحص الفني لهذه السيارة غير متاح بعد."
        action={
          <Link
            href={`/cars/${encodeURIComponent(viewModel.carId)}`}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition-colors"
          >
            العودة لتفاصيل السيارة
          </Link>
        }
      />
    );
  }

  const filterButtons: {
    id: "ALL" | ReportStatus;
    label: string;
    count: number;
    activeClass: string;
  }[] = [
    {
      id: "ALL",
      label: "الكل",
      count: totalQuestions,
      activeClass: "bg-primary-500 text-white border-primary-500",
    },
    {
      id: "GOOD",
      label: "سليم",
      count: goodCount,
      activeClass: "bg-green-500 text-white border-green-500",
    },
    {
      id: "WARN",
      label: "تنبيه",
      count: warnCount,
      activeClass: "bg-orange-500 text-white border-orange-500",
    },
    {
      id: "BAD",
      label: "تالف",
      count: badCount,
      activeClass: "bg-red-500 text-white border-red-500",
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      <PageBanner title="تقرير الفحص الفني" href="/inspection-report" />

      <main className="py-10 md:py-12 flex flex-col items-center">
        <MaxWidthWrapper className="w-full xl:grid xl:grid-cols-12 xl:gap-8 max-xl:space-y-6 2xl:px-[182px]!">
          {/* Main column */}
          <div className="flex-1 w-full flex flex-col gap-6 xl:col-span-9">
            {/* Report hero card */}
            <section className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-2xs">
              <div className="bg-primary-50/80 border-b border-gray-100 px-5 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/verify.svg"
                    alt=""
                    width={22}
                    height={22}
                  />
                  <h1 className="font-bold text-base md:text-lg text-gray-900">
                    تقرير الفحص الفني المعتمد
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                  <span>
                    رقم التقرير:{" "}
                    <span className="text-gray-800 font-bold">
                      #{viewModel.reportNumber}
                    </span>
                  </span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>
                    تاريخ الفحص:{" "}
                    <span className="text-gray-800 font-bold">
                      {viewModel.reportDate}
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <Image
                    src={viewModel.heroImage}
                    alt={`${viewModel.brand} ${viewModel.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>

                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      {viewModel.brand} - {viewModel.model}
                    </h2>
                    <Link
                      href={`/cars/${encodeURIComponent(viewModel.carId)}`}
                      className="text-xs text-primary-500 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      عرض إعلان السيارة
                      <span aria-hidden>←</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                      <span className="text-[11px] text-gray-500 font-medium block mb-1">
                        سنة الموديل
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {viewModel.year}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                      <span className="text-[11px] text-gray-500 font-medium block mb-1">
                        المسافة المقطوعة
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatMileage(viewModel.mileage)}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                      <span className="text-[11px] text-gray-500 font-medium block mb-1">
                        السعر التقديري
                      </span>
                      <span className="text-sm font-bold text-primary-500">
                        {formatPrice(viewModel.price)} ج.م
                      </span>
                    </div>
                    <div className="rounded-2xl bg-primary-50 border border-primary-100 px-4 py-3 flex items-center gap-3">
                      <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 36 36"
                          aria-hidden
                        >
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="#002ec1"
                            strokeWidth="3"
                            strokeDasharray="94.2"
                            strokeDashoffset={
                              94.2 - (94.2 * passedRate) / 100
                            }
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-primary-500">
                          {passedRate}%
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-gray-500 font-medium block">
                          معدل الاجتياز
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {goodCount} / {totalQuestions} بند
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status legend — matches car-details inspection card */}
              <div className="px-5 md:px-8 py-3 border-t border-gray-100 flex flex-wrap items-center gap-4 md:gap-6 text-xs select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="text-green-600 font-medium">
                    سليم ({goodCount})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  <span className="text-orange-500 font-medium">
                    تنبيه ({warnCount})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-[10px] font-bold">
                    ✕
                  </span>
                  <span className="text-red-600 font-medium">
                    تالف ({badCount})
                  </span>
                </div>
              </div>
            </section>

            {/* Sticky filters + section nav */}
            <div className="sticky top-2 z-20 flex flex-col gap-3 bg-gray-50/95 backdrop-blur-sm py-2 -my-1">
              <div className="bg-white border border-gray-100 rounded-[20px] px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs md:text-sm font-bold text-gray-700 shrink-0">
                  تصفية بنود الفحص
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {filterButtons.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFilter(btn.id)}
                      className={`text-xs px-3 py-1.5 rounded-2xl font-bold border transition-colors cursor-pointer ${
                        filter === btn.id
                          ? btn.activeClass
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {btn.label} ({btn.count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-2 min-w-max pb-0.5">
                  {viewModel.sections.map((section) => {
                    const active = activeSection === section.id;
                    const sectionGood = section.questions.filter(
                      (q) => q.status === "GOOD",
                    ).length;
                    const sectionIssues = section.questions.length - sectionGood;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                          active
                            ? "bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/15"
                            : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <Image
                          src={section.iconSrc}
                          alt=""
                          width={18}
                          height={18}
                          className={active ? "brightness-0 invert" : "opacity-60"}
                        />
                        <span>{section.title}</span>
                        {sectionIssues > 0 ? (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-orange-50 text-orange-500"
                            }`}
                          >
                            {sectionIssues}!
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sections */}
            {viewModel.sections
              .filter((s) => s.questions.length > 0)
              .map((section) => {
                const visibleQuestions = section.questions.filter((q) =>
                  filterQuestion(q.status),
                );
                const sectionGood = section.questions.filter(
                  (q) => q.status === "GOOD",
                ).length;
                const sectionWarn = section.questions.filter(
                  (q) => q.status === "WARN",
                ).length;
                const sectionBad = section.questions.filter(
                  (q) => q.status === "BAD",
                ).length;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    ref={(el) => {
                      sectionRefs.current[section.id] = el;
                    }}
                    className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-2xs"
                  >
                    <div className="bg-gray-50/80 border-b border-gray-100 px-5 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={section.iconSrc}
                          alt=""
                          width={24}
                          height={24}
                          className="opacity-60"
                        />
                        <h2 className="text-base md:text-lg font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        {sectionGood > 0 ? (
                          <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-lg border border-green-100">
                            {String(sectionGood).padStart(2, "0")} ✓
                          </span>
                        ) : null}
                        {sectionWarn > 0 ? (
                          <span className="bg-orange-50 text-orange-500 px-2 py-0.5 rounded-lg border border-orange-100">
                            {String(sectionWarn).padStart(2, "0")} !
                          </span>
                        ) : null}
                        {sectionBad > 0 ? (
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg border border-red-100">
                            {String(sectionBad).padStart(2, "0")} ✕
                          </span>
                        ) : null}
                        <span className="text-gray-400 font-medium">
                          {sectionGood} من {section.questions.length} سليمة
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-6 flex flex-col gap-5">
                      {section.sectionNote ? (
                        <p className="text-xs text-gray-500 bg-primary-50/50 p-3 rounded-2xl border border-primary-100 leading-relaxed">
                          {section.sectionNote}
                        </p>
                      ) : null}

                      {/* Photos */}
                      <div>
                        <span className="text-xs font-bold text-gray-500 block mb-2.5">
                          الصور المرفقة للقسم
                        </span>
                        {section.photos.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {section.photos.map((p, idx) => (
                              <div key={idx} className="flex flex-col gap-1.5">
                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-100">
                                  <Image
                                    src={p.url}
                                    alt={p.description || section.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 15vw"
                                  />
                                </div>
                                {p.description ? (
                                  <span className="text-[10px] text-gray-500 text-center leading-tight">
                                    {p.description}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                              <Image
                                src="/icons/image.svg"
                                alt=""
                                width={20}
                                height={20}
                                className="opacity-40"
                              />
                            </div>
                            <div className="flex flex-col text-start">
                              <span className="text-xs font-bold text-gray-600">
                                لا توجد صور مرفقة
                              </span>
                              <span className="text-[11px] text-gray-400 leading-relaxed">
                                لم يتم رصد أعطال تستدعي التصوير في هذا القسم.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Questions */}
                      {visibleQuestions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {visibleQuestions.map((q) => (
                            <div
                              key={q.id}
                              className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-colors ${statusCardClass(q.status)}`}
                            >
                              <StatusIcon status={q.status} />
                              <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <span className="text-sm font-bold text-gray-800 leading-snug">
                                  {q.label}
                                </span>
                                {q.notes ? (
                                  <span
                                    className={`text-xs font-semibold ${statusTextClass(q.status)}`}
                                  >
                                    {q.notes}
                                  </span>
                                ) : (
                                  <span
                                    className={`text-xs font-semibold ${statusTextClass(q.status)}`}
                                  >
                                    {statusLabel(q.status)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-6">
                          لا توجد بنود تطابق التصفية المحددة.
                        </p>
                      )}
                    </div>
                  </section>
                );
              })}
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 flex flex-col gap-5 xl:col-span-3 xl:sticky xl:top-24 h-fit">
            {/* Inspector note */}
            <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-2xs">
              <div className="bg-primary-50/80 border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
                <Image
                  src="/icons/inspect.svg"
                  alt=""
                  width={18}
                  height={18}
                />
                <h3 className="text-sm font-bold text-gray-900">
                  ملاحظة المفتش الفني
                </h3>
              </div>
              <p className="px-5 py-4 text-xs text-gray-600 leading-relaxed">
                تقرير الفحص يلخّص حالة المركبة وفق البنود المسجّلة. راجع
                التفاصيل الكاملة في كل قسم قبل اتخاذ قرار الشراء.
              </p>
            </div>

            {/* Maintenance CTA */}
            <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-2xs">
              <div className="bg-orange-50/80 border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
                <Image
                  src="/icons/car-repair.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="opacity-70"
                />
                <h3 className="text-sm font-bold text-gray-900">
                  توصية الصيانة القادمة
                </h3>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  راجع البنود المصنّفة كـ&quot;تنبيه&quot; أو &quot;تالف&quot;
                  للتنسيق مع مركز صيانة معتمد قبل التسليم.
                </p>
                <a
                  href="https://wa.me/19900"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold text-sm h-12 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Image
                    src="/assets/whatsapp.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <span>حجز موعد صيانة</span>
                </a>
              </div>
            </div>

            {/* Share / print */}
            <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-2xs">
              <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
                <Image src="/icons/share.svg" alt="" width={18} height={18} />
                <h3 className="text-sm font-bold text-gray-900">
                  حفظ ومشاركة التقرير
                </h3>
              </div>
              <div className="px-5 py-4 flex flex-col gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 py-0"
                  onClick={() => window.print()}
                >
                  تحميل التقرير كـ PDF
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="h-11 py-0"
                  onClick={() => void handleCopyLink()}
                >
                  {copied ? "تم نسخ الرابط ✓" : "نسخ رابط المشاركة"}
                </Button>
              </div>
            </div>

            {/* Back to car */}
            <Link
              href={`/cars/${encodeURIComponent(viewModel.carId)}`}
              className="bg-primary-500 hover:bg-primary-600 text-white text-sm w-full py-3.5 rounded-2xl flex items-center justify-center shadow-md transition-colors font-bold"
            >
              العودة لتفاصيل السيارة
            </Link>
          </aside>
        </MaxWidthWrapper>
      </main>
    </div>
  );
}

/**
 * Outer page: provides the `<Suspense>` boundary that the
 * `useSearchParams` API docs require for production builds. The
 * `Suspense` fallback matches the loading spinner the inner component
 * shows, so there's no visual jump on first render.
 */
export default function InspectionReport() {
  return (
    <Suspense fallback={<LoadingState />}>
      <InspectionReportInner />
    </Suspense>
  );
}
