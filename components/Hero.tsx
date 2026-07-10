"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import Dropdown from "./common/Dropdown";
import { filterFields } from "@/constants/car-filters";
import { cn, fakePromise } from "@/lib/utils";
import Spinner from "./common/Spinner";

const CarCardType = ({
  variant = "blurry",
  setCarType,
  carType,
  image,
  currentCarType,
}: {
  variant?: "white" | "blurry";
  setCarType: (v: string) => void;
  carType: string;
  image: string;
  currentCarType: string;
}) => {
  const isSelected = currentCarType === carType;
  return (
    <button
      onClick={() => setCarType(carType)}
      className={cn(
        " rounded-2xl flex items-center justify-center gap-1 items-center aspect-square w-[106px]",
        variant === "blurry"
          ? isSelected
            ? "bg-[#E9F0FC]"
            : "bg-black/30 backdrop-blur-lg"
          : isSelected
            ? "border border-primary-500 bg-[#E9F0FC80]"
            : "border border-[#1313131A]",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="">
          <Image src={image} alt="car type" width={38} height={38} />
        </div>
        <h3
          className={cn(
            "text-sm",
            variant === "blurry"
              ? isSelected
                ? "text-black"
                : "text-white"
              : isSelected
                ? "text-primary-500"
                : "text-black",
          )}
        >
          {carType}
        </h3>
      </div>
    </button>
  );
};

export default function Hero() {
  const [searchByTab, setSearchByTab] = useState<"type" | "details">("details");

  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    transmission: "",
    kilometer: "",
    model: "",
    condition: "",
    release: "",
    brand: "",
  });

  const [carType, setCarType] = useState("all");

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const showResultsHandler = () => {
    // console.log(filters);
    startTransition(async () => {
      await fakePromise();
    });
  };

  return (
    <section className="relative w-full min-h-[820px] flex flex-col items-center justify-center pt-28 lg:pt-32 pb-16 overflow-hidden bg-white lg:bg-transparent">
      {/* Background Images and Gradients - Hidden on Mobile */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Image
          src="/images/home/hero.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Hero content */}
      <MaxWidthWrapper>
        <div className="relative z-10 w-full flex flex-col items-center gap-8 lg:gap-12 ">
          {/* Headings */}
          <div className="text-center text-primary-500 lg:text-white flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold lg:drop-shadow-md leading-[150%]">
              بيع و اشتري سيارتك مع الجراج بأفضل سعر وأكثر ثقة
            </h1>
            <p className="text-sm md:text-[18px] text-gray-500 lg:text-white/90 leading-[150%] font-medium lg:drop-shadow-sm">
              أكثر من 1,200 سيارة مفحوصة ومعتمدة. ابحث، قارن، واشتري بثقة مع
              ضمان الفحص الاحترافي.
            </p>
          </div>

          {/* Mobile Standalone Image Card */}
          <div className="relative w-full md:aspect-[335/148] aspect-video rounded-[24px] overflow-hidden lg:hidden shadow-sm">
            <Image
              src="/assets/hero_bg_decor2.png"
              alt="elGARAGE Handshake"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Filter Card Container */}
          <div className="w-full flex flex-col items-center gap-6">
            {/* Search Type Row (البحث حسب) */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 text-gray-900 lg:text-white bg-white lg:bg-transparent p-4 lg:p-0 rounded-[20px] shadow-sm lg:shadow-none border border-gray-100 lg:border-none w-full">
              <span className="text-sm font-bold lg:font-medium text-right w-full lg:w-auto">
                البحث حسب :
              </span>
              <div className="bg-[#0000001A] lg:backdrop-blur-md lg:bg-black/25 border border-gray-200/50 lg:border-white/10 rounded-2xl p-1 flex gap-2 w-full lg:w-[320px]">
                <button
                  onClick={() => setSearchByTab("details")}
                  className={`flex-1 text-center  rounded-2xl w-[192.5px] h-[40px] py-2.5 lg:py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    searchByTab === "details"
                      ? "bg-white text-primary-500 shadow-sm font-bold"
                      : "text-gray-500 lg:text-gray-200 hover:text-gray-800 lg:hover:text-white"
                  }`}
                >
                  تفاصيل السيارة
                </button>
                <button
                  onClick={() => setSearchByTab("type")}
                  className={`flex-1 text-center rounded-2xl w-[192.5px] h-[40px]  py-2.5 lg:py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    searchByTab === "type"
                      ? "bg-white text-primary-500 shadow-sm font-bold"
                      : "text-gray-500 lg:text-gray-200 hover:text-gray-800 lg:hover:text-white"
                  }`}
                >
                  نوع السيارة
                </button>
              </div>
            </div>

            {/* Filters Form */}
            <div className="w-full bg-white lg:backdrop-blur-lg lg:bg-black/20 max-lg:border max-lg:border-gray-100 rounded-[24px] p-4 lg:py-8 lg:px-6 flex flex-col gap-6 shadow-md lg:shadow-2xl">
              {searchByTab === "details" ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 max-lg:hidden">
                    {filterFields.map((field, i) => (
                      <Dropdown
                        key={i}
                        label={field.label}
                        placeholder={field.placeholder}
                        option={Object.values(filters)[i]}
                        options={field.options}
                        setOption={(val) =>
                          handleFilterChange(Object.keys(filters)[i], val)
                        }
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:hidden">
                    {filterFields.map((field, i) => (
                      <Dropdown
                        key={i}
                        label={field.label}
                        placeholder={field.placeholder}
                        option={Object.values(filters)[i]}
                        options={field.options}
                        setOption={(val) =>
                          handleFilterChange(Object.keys(filters)[i], val)
                        }
                        variant="gray"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-3 flex-wrap max-lg:hidden">
                    {Array(11)
                      .fill(0)
                      .map((item, i) => (
                        <CarCardType
                          image={"/car-type.svg"}
                          key={i}
                          carType={`car ${i + 1}`}
                          currentCarType={carType}
                          setCarType={(v) => setCarType(v)}
                        />
                      ))}
                  </div>

                  <div className="flex gap-3 flex-wrap lg:hidden">
                    {Array(11)
                      .fill(0)
                      .map((item, i) => (
                        <CarCardType
                          image={"/car-type.svg"}
                          key={i}
                          variant={"white"}
                          carType={`car ${i + 1}`}
                          currentCarType={carType}
                          setCarType={(v) => setCarType(v)}
                        />
                      ))}
                  </div>
                </>
              )}

              {/* Results Button */}
              <div className="flex max-lg:justify-center w-full">
                <button
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm h-12 w-full lg:max-w-[420px] rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  onClick={showResultsHandler}
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : <span>عرض النتائج</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
