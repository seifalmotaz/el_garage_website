"use client";

import { useState } from "react";
import Image from "next/image";

function ArrowIcon({ className, strokeColor = "currentColor" }: { className?: string; strokeColor?: string }) {
  return (
    <svg
      viewBox="0 0 20.4545 20.4545"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.7841 16.9773L7.22727 11.4205C6.57102 10.7642 6.57102 9.69034 7.22727 9.03409L12.7841 3.47727"
        stroke={strokeColor}
        strokeWidth="1.27841"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Reviews() {
  const reviews = [
    {
      name: "سارة أحمد",
      carInfo: "هونداي سنتافي GL 2018 دبل 2018 / مستعملة",
      comment: "امانة وسرعة وأفضل سعر في السوق!",
      bgImage: "/assets/review_car_placeholder.png",
      avatars: [
        "/assets/review_avatar_1a.svg",
        "/assets/review_avatar_1b.svg",
        "/assets/review_avatar_1c.svg",
        "/assets/review_avatar_1d.svg",
        "/assets/review_avatar_1e.svg",
        "/assets/review_avatar_1f.svg",
        "/assets/review_avatar_1g.svg",
        "/assets/review_avatar_1h.svg",
        "/assets/review_avatar_1i.svg",
        "/assets/review_avatar_1j.svg"
      ]
    },
    {
      name: "فاطمة عبدالله",
      carInfo: "رينو تاليمان 2026 / جديدة",
      comment: "الجراج بيضمنلك العربية الصح ويخلصك من الهم. نصيحة مني جربوه!",
      bgImage: "/assets/review_car_placeholder.png",
      avatars: [
        "/assets/review_avatar_1a.svg",
        "/assets/review_avatar_1b.svg",
        "/assets/review_avatar_1c.svg",
        "/assets/review_avatar_1d.svg",
        "/assets/review_avatar_1e.svg",
        "/assets/review_avatar_1f.svg",
        "/assets/review_avatar_1g.svg",
        "/assets/review_avatar_1h.svg",
        "/assets/review_avatar_1i.svg",
        "/assets/review_avatar_1j.svg"
      ]
    },
    {
      name: "أحمد محمود",
      carInfo: "تويوتا كامري 2023 / مستعملة",
      comment: "ضامن فحص كامل وتقييمات حقيقية من الناس. أحسن مكان لبيع عربيتك من غير اي غش",
      bgImage: "/assets/review_car_placeholder.png",
      avatars: [
        "/assets/review_avatar_3a.svg",
        "/assets/review_avatar_3b.svg",
        "/assets/review_avatar_3c.svg",
        "/assets/review_avatar_3d.svg",
        "/assets/review_avatar_3e.svg",
        "/assets/review_avatar_3f.svg",
        "/assets/review_avatar_3g.svg",
        "/assets/review_avatar_3h.svg",
        "/assets/review_avatar_3i.svg"
      ]
    }
  ];

  return (
    <section id="reviews" className="bg-white py-16 px-6 md:px-12 flex flex-col items-center gap-8 w-full border-b border-gray-100">
      <div className="w-full max-w-[1336px] flex flex-col gap-6">

        {/* Title & Navigation Controls */}
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
          <h2 className="text-[#0C295A] font-bold text-2xl md:text-3xl">
            اراء عملائنا
          </h2>

          {/* Arrow navigation buttons */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors flex items-center justify-center shadow-md">
              <ArrowIcon className="w-5 h-5 rotate-180" strokeColor="currentColor" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[#0C0507] hover:text-[#002EC1] transition-colors flex items-center justify-center border border-gray-200/40">
              <ArrowIcon className="w-5 h-5" strokeColor="currentColor" />
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[370px] flex flex-col justify-end px-5 py-8 select-none group"
            >
              {/* Background Car Photo */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={review.bgImage}
                  alt={review.name}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002EC1]/90 to-transparent" />
              </div>

              {/* Reviewer Details & Quote */}
              <div className="relative z-10 text-right text-white flex flex-col gap-4">

                {/* Reviewer Profile */}
                <div className="flex items-start justify-start gap-3">
                  {/* Composited layered SVG avatar badge */}
                  <div className="bg-[#EBF1FF] border border-white p-1.5 rounded-full relative w-11 h-11 flex items-center justify-start shrink-0">
                    {review.avatars[0].includes("review_avatar_1") ? (
                      // Female Avatar (Sara, Fatima)
                      <div className="relative w-6 h-[30px] shrink-0">
                        <img src={review.avatars[0]} alt="" style={{ position: "absolute", left: "1.67px", top: "0px", width: "20.657px", height: "20.038px" }} />
                        <img src={review.avatars[1]} alt="" style={{ position: "absolute", left: "0px", top: "20.91px", width: "24px", height: "8.652px" }} />
                        <img src={review.avatars[2]} alt="" style={{ position: "absolute", left: "9.87px", top: "16.02px", width: "4.252px", height: "6.97px" }} />
                        <img src={review.avatars[3]} alt="" style={{ position: "absolute", left: "9.87px", top: "17.77px", width: "4.252px", height: "2.268px" }} />
                        <img src={review.avatars[4]} alt="" style={{ position: "absolute", left: "6.33px", top: "2.87px", width: "11.333px", height: "15.831px" }} />
                        <img src={review.avatars[5]} alt="" style={{ position: "absolute", left: "4.21px", top: "10.82px", width: "3.1px", height: "3.1px" }} />
                        <img src={review.avatars[6]} alt="" style={{ position: "absolute", left: "4.55px", top: "11.16px", width: "1.308px", height: "1.308px" }} />
                        <img src={review.avatars[7]} alt="" style={{ position: "absolute", left: "16.69px", top: "10.82px", width: "3.1px", height: "3.1px" }} />
                        <img src={review.avatars[8]} alt="" style={{ position: "absolute", left: "18.14px", top: "11.16px", width: "1.308px", height: "1.308px" }} />
                        <img src={review.avatars[9]} alt="" style={{ position: "absolute", left: "5.76px", top: "1.97px", width: "12.476px", height: "7.496px" }} />
                      </div>
                    ) : (
                      // Male Avatar (Ahmed)
                      <div className="relative w-[26.4px] h-[30px] shrink-0">
                        <img src={review.avatars[0]} alt="" style={{ position: "absolute", left: "0px", top: "20.41px", width: "26.389px", height: "9.513px" }} />
                        <img src={review.avatars[1]} alt="" style={{ position: "absolute", left: "10.86px", top: "15.03px", width: "4.675px", height: "7.663px" }} />
                        <img src={review.avatars[2]} alt="" style={{ position: "absolute", left: "10.86px", top: "16.95px", width: "4.675px", height: "2.494px" }} />
                        <img src={review.avatars[3]} alt="" style={{ position: "absolute", left: "6.96px", top: "0.52px", width: "12.461px", height: "17.407px" }} />
                        <img src={review.avatars[4]} alt="" style={{ position: "absolute", left: "4.63px", top: "9.3px", width: "3.408px", height: "3.408px" }} />
                        <img src={review.avatars[5]} alt="" style={{ position: "absolute", left: "5.01px", top: "9.68px", width: "1.438px", height: "1.438px" }} />
                        <img src={review.avatars[6]} alt="" style={{ position: "absolute", left: "18.35px", top: "9.3px", width: "3.408px", height: "3.408px" }} />
                        <img src={review.avatars[7]} alt="" style={{ position: "absolute", left: "19.94px", top: "9.68px", width: "1.438px", height: "1.438px" }} />
                        <img src={review.avatars[8]} alt="" style={{ position: "absolute", left: "6.51px", top: "0px", width: "13.368px", height: "7.633px" }} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-medium text-base text-white">
                      {review.name}
                    </h4>
                    <p className="text-white/70 text-sm font-normal">
                      {review.carInfo}
                    </p>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-base font-normal leading-relaxed">
                  {review.comment}
                </p>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
