import MaxWidthWrapper from "../common/MaxWidthWrapper";
import { Carousel, CarouselContent, CarouselItem } from "../common/Carousel";
import CarCard from "../CarCard";
import { useDragClickableCards } from "@/hooks/useDragClickableCards";
import ShowMoreLink from "../common/ShowMoreLink";

const SimilarCars = ({ recommendedCars }: { recommendedCars: any[] }) => {
  const { handleMouseDown, handleMouseMove, handleClick } =
    useDragClickableCards();

  return (
    <MaxWidthWrapper className="w-full mx-auto mt-16 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
        <h3 className="text-gray-900 font-bold text-xl md:text-2xl">
          سيارات مشابهة
        </h3>
        <ShowMoreLink href="/cars" />
      </div>
      {/* Mobile swipeable horizontal container, hidden on medium and above */}
      <Carousel dir="rtl" className="sm:hidden">
        <CarouselContent className="">
          {recommendedCars.map((similarCar) => (
            <CarouselItem
              key={similarCar.id}
              className="basis-1/1 relative pl-3 last:pl-0 overflow-hidden  transition-all rounded-2xl duration-300 h-[370px] select-none group"
            >
              <div
                key={similarCar.id}
                onClick={(e) => handleClick(e, `/cars/${similarCar.id}`)}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                <div className="pointer-events-none">
                  <CarCard key={similarCar.id} {...similarCar} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Desktop grid layout, hidden on mobile */}
      <div className="max-sm:hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {recommendedCars.map((similarCar) => (
          <CarCard key={similarCar.id} {...similarCar} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default SimilarCars;
