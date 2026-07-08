"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

const Pagination = ({
  totalPages,
  activePage,
  setCurrentPage,
}: {
  totalPages: number;
  activePage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const handlePageChange = (page?: number) => {
    // if (page >= 1 && page <= totalPages) {
    const element = document.getElementById("pagination-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // }
  };

  return (
    totalPages > 1 && (
      <div className="flex items-center justify-center gap-6 mt-8 select-none">
        {/* Arrow Left (Next page in RTL / Left direction) */}
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            setTimeout(() => handlePageChange(), 50);
          }}
          disabled={activePage === totalPages}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight />
        </button>

        {/* Page numbers (LTR ordered for correct rendering layout) */}
        <div className="flex items-center gap-2" dir="ltr">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isActive = page === activePage;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`size-8 rounded-full font-medium text-sm transition-colors cursor-pointer flex items-center justify-center
                          ${
                            isActive
                              ? "bg-primary-500 border border-primary-500 text-white shadow-sm"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600"
                          }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Arrow Right (Prev page in RTL / Right direction) */}
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            setTimeout(() => handlePageChange(), 50);
          }}
          disabled={activePage === 1}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft />
        </button>
      </div>
    )
  );
};

export default Pagination;
