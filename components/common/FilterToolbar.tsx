import { model_options } from "@/constants/car-filters";
import Dropdown from "./Dropdown";
import Image from "next/image";
import { initialCars } from "@/constants/cars";

type CarType =
  | {
      id: string;
      brand: string;
      model: string;
      price: string;
      installment: string;
      year: string;
      mileage: string;
      trim: string;
      location: string;
      isFeatured: boolean;
      isCertified: boolean;
      discountText: string;
      image: string;
    }
  | {
      id: string;
      brand: string;
      model: string;
      price: string;
      installment: string;
      year: string;
      mileage: string;
      trim: string;
      location: string;
      isFeatured: boolean;
      isCertified: boolean;
      image: string;
      discountText?: undefined;
    };

const FilterToolbar = ({
  selectedModel,
  setSelectedModel,
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
  setFilteredCars,
  isFeaturedMode,
}: {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setFilteredCars: (value: CarType[]) => void;
  isFeaturedMode: boolean;
}) => {
  const getFilteredCars = () => {
    return initialCars
      .filter((car) => {
        if (isFeaturedMode && !car.isFeatured) return false;

        const matchesSearch =
          car.brand.includes(searchTerm) ||
          car.model.includes(searchTerm) ||
          car.trim.includes(searchTerm);

        const matchesModel =
          selectedModel === "all" || car.brand === selectedModel;

        return matchesSearch && matchesModel;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/,/g, ""));
        const priceB = parseFloat(b.price.replace(/,/g, ""));
        if (sortBy === "high-to-low") return priceB - priceA;
        return priceA - priceB;
      });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 w-full">
      {/* Right side filters: Model & Sorting */}
      <div className="flex flex-row items-center gap-8 w-full md:w-auto md:flex-initial">
        {/* Model Dropdown */}

        <Dropdown
          label="الموديل"
          placeholder="حدد الموديل"
          option={selectedModel}
          options={[{ label: "كل الموديلات", value: "all" }, ...model_options]}
          setOption={(val) => setSelectedModel(val)}
          className="w-[252px]"
          variant="white"
        />

        <Dropdown
          label="ترتيب حسب"
          placeholder=""
          option={sortBy}
          options={[
            { label: "السعر - من الاعلى الي الاقل", value: "high-to-low" },
            { label: "السعر - من الاقل الي الاعلى", value: "low-to-high" },
          ]}
          setOption={(val) => setSortBy(val)}
          className="w-[252px]"
          variant="white"
        />
      </div>

      {/* Left side: Search input */}
      <div className="flex flex-col gap-1.5 text-right w-full md:max-w-[600px]">
        <label className="text-gray-900 text-xs font-semibold px-1">
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
          <button
            onClick={() => {
              setFilteredCars(getFilteredCars());
            }}
            className="bg-white border border-gray-200 hover:bg-primary-50 text-primary-500 font-semibold w-[120px] cursor-pointer text-xs px-6 rounded-xl transition-colors shrink-0"
          >
            بحث
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;
