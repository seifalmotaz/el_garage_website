import Image from "next/image";

const NotFoundFeedback = ({ resetHandler }: { resetHandler: () => void }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
      <Image
        src="/assets/search_normal.svg"
        alt="no results"
        width={48}
        height={48}
        className="opacity-20"
      />
      <h3 className="text-lg font-bold text-gray-800">لا توجد نتائج مطابقة</h3>
      <p className="text-sm text-gray-400 max-w-[320px]">
        جرب تغيير فلاتر البحث أو إعادة تعيين الكل لرؤية جميع السيارات المتاحة
      </p>
      <button
        onClick={resetHandler}
        className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2.5 px-6 rounded-xl mt-2 transition-colors cursor-pointer"
      >
        إعادة تعيين الكل
      </button>
    </div>
  );
};

export default NotFoundFeedback;
