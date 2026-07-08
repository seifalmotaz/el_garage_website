import { model_options } from "@/constants/car-filters";
import Dropdown from "./Dropdown";
import Image from "next/image";
import Button from "./Button";
import { cn } from "@/lib/utils";

const FilterToolbar = ({
  selectedModel,
  setSelectedModel,
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
  searchAction,
  isLeftCol = false,
  isPending = false,
}: {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchAction: () => void;
  isLeftCol?: boolean;
  isPending?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-8 w-full",
        isLeftCol ? "2xl:flex-row 2xl:items-end" : "md:flex-row md:items-end",
      )}
    >
      {/* Right side filters: Model & Sorting */}
      <div className="flex flex-row items-center sm:gap-8 gap-2 w-full md:w-auto md:flex-initial">
        {/* Model Dropdown */}
        <Dropdown
          label="الموديل"
          placeholder="حدد الموديل"
          option={selectedModel}
          options={[{ label: "كل الموديلات", value: "all" }, ...model_options]}
          setOption={(val) => {
            setSelectedModel(val);
          }}
          className={isLeftCol ? "2xl:w-[252px] w-full" : "w-[252px]"}
          variant="white"
        />

        <Dropdown
          label="ترتيب حسب"
          placeholder=""
          option={sortBy}
          options={[
            { label: "السعر - من الاعلى الي الاقل", value: "high-to-low" },
            { label: "السعر - من الاقل الي الاعلى", value: "low-to-high" },
            { label: "الأقدم", value: "newest" },
            { label: "الأحدث", value: "oldest" },
          ]}
          setOption={(val) => {
            setSortBy(val);
          }}
          className={isLeftCol ? "2xl:w-[252px] w-full" : "w-[252px]"}
          variant="white"
        />
      </div>

      {/* Left side: Search input */}
      <div
        className={cn(
          "flex flex-col gap-2 text-right w-full",
          isLeftCol ? "md:max-w-full" : "md:max-w-[600px]",
        )}
      >
        <label className="text-gray-900 text-sm px-1 leading-[100%]">
          البحث
        </label>
        <div className="flex gap-2 w-full">
          <div className="relative flex-1 bg-white border border-gray-200 rounded-xl h-[50px] flex items-center justify-between px-3">
            <input
              type="text"
              placeholder="بتدور على ايه !"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={searchAction}
            isLoading={isPending}
            disabled={isPending}
            spinnerVariant={"primary"}
            className="bg-white border border-gray-200 hover:bg-primary-50 text-primary-500 font-semibold w-[120px]"
          >
            بحث
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;
