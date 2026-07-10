"use client";
import {
  Children,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, Transition, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselDirection = "ltr" | "rtl";

export type CarouselContextType = {
  index: number;
  setIndex: (newIndex: number) => void;
  itemsCount: number;
  setItemsCount: (newItemsCount: number) => void;
  disableDrag: boolean;
  dir: CarouselDirection;
};

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined,
);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within an CarouselProvider");
  }
  return context;
}

export type CarouselProviderProps = {
  children: ReactNode;
  initialIndex?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
  dir?: CarouselDirection;
};

function CarouselProvider({
  children,
  initialIndex = 0,
  onIndexChange,
  disableDrag = false,
  dir = "ltr",
}: CarouselProviderProps) {
  const [index, setIndex] = useState<number>(initialIndex);
  const [itemsCount, setItemsCount] = useState<number>(0);

  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  return (
    <CarouselContext.Provider
      value={{
        index,
        setIndex: handleSetIndex,
        itemsCount,
        setItemsCount,
        disableDrag,
        dir,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

export type CarouselProps = {
  children: ReactNode;
  className?: string;
  initialIndex?: number;
  index?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
  dir?: CarouselDirection;
};

function Carousel({
  children,
  className,
  initialIndex = 0,
  index: externalIndex,
  onIndexChange,
  disableDrag = false,
  dir = "ltr",
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState<number>(initialIndex);
  const isControlled = externalIndex !== undefined;
  const currentIndex = isControlled ? externalIndex : internalIndex;

  const handleIndexChange = (newIndex: number) => {
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    onIndexChange?.(newIndex);
  };

  return (
    <CarouselProvider
      initialIndex={currentIndex}
      onIndexChange={handleIndexChange}
      disableDrag={disableDrag}
      dir={dir}
    >
      <div dir={dir} className={cn("group/hover relative", className)}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </CarouselProvider>
  );
}

export type CarouselNavigationProps = {
  className?: string;
  classNameButton?: string;
  alwaysShow?: boolean;
};

function CarouselNavigation({
  className,
  classNameButton,
  alwaysShow,
}: CarouselNavigationProps) {
  const { index, setIndex, itemsCount, dir } = useCarousel();
  const isRtl = dir === "rtl";

  // In RTL, content flows right-to-left, so the visually-left button
  // moves the carousel forward (next) and the visually-right button
  // moves it backward (previous).
  const leftButtonDisabled = isRtl ? index + 1 === itemsCount : index === 0;
  const rightButtonDisabled = isRtl ? index === 0 : index + 1 === itemsCount;

  const handleLeftClick = () => {
    if (isRtl) {
      if (index < itemsCount - 1) setIndex(index + 1);
    } else {
      if (index > 0) setIndex(index - 1);
    }
  };

  const handleRightClick = () => {
    if (isRtl) {
      if (index > 0) setIndex(index - 1);
    } else {
      if (index < itemsCount - 1) setIndex(index + 1);
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute gap-3 top-0 flex justify-between",
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "pointer-events-auto flex justify-center items-center size-10 rounded-full bg-zinc-50 p-2 transition-opacity duration-300",
          rightButtonDisabled ? "" : "bg-primary-500! ",
          alwaysShow
            ? "opacity-100"
            : "opacity-0 group-hover/hover:opacity-100",
          alwaysShow
            ? "disabled:opacity-40"
            : "group-hover/hover:disabled:opacity-40",
          classNameButton,
        )}
        aria-label={isRtl ? "Previous slide" : "Next slide"}
        disabled={rightButtonDisabled}
        onClick={handleRightClick}
      >
        <ChevronRight
          className={rightButtonDisabled ? "stroke-zinc-600" : "stroke-white!"}
          size={20}
        />
      </button>
      <button
        type="button"
        aria-label={isRtl ? "Next slide" : "Previous slide"}
        className={cn(
          "pointer-events-auto flex justify-center items-center size-10 rounded-full p-2 transition-opacity duration-300",
          leftButtonDisabled ? "" : "bg-primary-500! ",
          alwaysShow
            ? "opacity-100"
            : "opacity-0 group-hover/hover:opacity-100",
          alwaysShow
            ? "disabled:opacity-40"
            : "group-hover/hover:disabled:opacity-40",
          classNameButton,
        )}
        disabled={leftButtonDisabled}
        onClick={handleLeftClick}
      >
        <ChevronLeft
          size={20}
          className={leftButtonDisabled ? "stroke-zinc-600" : "stroke-white!"}
        />
      </button>
    </div>
  );
}

export type CarouselIndicatorProps = {
  className?: string;
  classNameButton?: string;
};

function CarouselIndicator({
  className,
  classNameButton,
}: CarouselIndicatorProps) {
  const { index, itemsCount, setIndex } = useCarousel();

  return (
    <div
      className={cn(
        "absolute bottom-0 z-10 flex w-full items-center justify-center",
        className,
      )}
    >
      <div className="flex space-x-2">
        {Array.from({ length: itemsCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-opacity duration-300",
              index === i
                ? "bg-zinc-950 dark:bg-zinc-50"
                : "bg-zinc-900/50 dark:bg-zinc-100/50",
              classNameButton,
            )}
          />
        ))}
      </div>
    </div>
  );
}

export type CarouselContentProps = {
  children: ReactNode;
  className?: string;
  transition?: Transition;
};

function CarouselContent({
  children,
  className,
  transition,
}: CarouselContentProps) {
  const { index, setIndex, setItemsCount, disableDrag, dir } = useCarousel();
  const isRtl = dir === "rtl";
  const [visibleItemsCount, setVisibleItemsCount] = useState(1);
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsLength = Children.count(children);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const options = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleCount = entries.filter(
        (entry) => entry.isIntersecting,
      ).length;
      setVisibleItemsCount(visibleCount);
    }, options);

    const childNodes = containerRef.current.children;
    Array.from(childNodes).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [children, setItemsCount]);

  useEffect(() => {
    if (!itemsLength) {
      return;
    }

    setItemsCount(itemsLength);
  }, [itemsLength, setItemsCount]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (isRtl) {
      // Dragging right (positive x) advances to the next slide in RTL.
      if (x >= 10 && index < itemsLength - 1) {
        setIndex(index + 1);
      } else if (x <= -10 && index > 0) {
        setIndex(index - 1);
      }
    } else {
      if (x <= -10 && index < itemsLength - 1) {
        setIndex(index + 1);
      } else if (x >= 10 && index > 0) {
        setIndex(index - 1);
      }
    }
  };

  const translatePercent = index * (100 / visibleItemsCount);

  return (
    <motion.div
      drag={disableDrag ? false : "x"}
      dragConstraints={
        disableDrag
          ? undefined
          : {
              left: 0,
              right: 0,
            }
      }
      dragMomentum={disableDrag ? undefined : false}
      style={{
        x: disableDrag ? undefined : dragX,
      }}
      animate={{
        translateX: isRtl ? `${translatePercent}%` : `-${translatePercent}%`,
      }}
      onDragEnd={disableDrag ? undefined : onDragEnd}
      transition={
        transition || {
          damping: 18,
          stiffness: 90,
          type: "spring",
          duration: 0.2,
        }
      }
      className={cn(
        "flex items-center",
        !disableDrag && "cursor-grab active:cursor-grabbing",
        className,
      )}
      ref={containerRef}
    >
      {children}
    </motion.div>
  );
}

export type CarouselItemProps = {
  children: ReactNode;
  className?: string;
};

function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <motion.div
      className={cn(
        "w-full min-w-0 shrink-0 grow-0 overflow-hidden",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
  useCarousel,
};
