/* components/features/ReviewSection.tsx */
"use client";

import { REVIEWS } from "@/constants/data";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function ReviewSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý cuộn sang trái/phải
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="mt-20 bg-blue-50/30 py-24 -mx-4 px-4 rounded-[60px] relative overflow-hidden"> 
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 px-4">
            <div>
                <h2 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-4 leading-none">
                    Đánh giá từ khách hàng
                </h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] italic">
                    Hơn 10,000+ hành trình trọn vẹn cùng BonbonCar
                </p>
            </div>
            {/* NÚT ĐIỀU HƯỚNG */}
            <div className="flex gap-4">
                <button onClick={() => scroll('left')} className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-blue-100">
                    <ChevronLeft size={28} />
                </button>
                <button onClick={() => scroll('right')} className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-blue-100">
                    <ChevronRight size={28} />
                </button>
            </div>
        </div>
        
        {/* KHÔNG GIAN CUỘN SLIDER (Mũi tên kéo qua) */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 scroll-smooth px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {REVIEWS.map((rev) => (
            <div 
              key={rev.id} 
              className="min-w-[100%] md:min-w-[45%] lg:min-w-[31%] bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 snap-center relative group hover:shadow-xl transition-all duration-500"
            >
              <Quote className="absolute top-8 right-10 text-blue-100 opacity-40 group-hover:text-blue-200 transition-colors" size={48} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < rev.rating ? "#2563eb" : "none"} className={i < rev.rating ? "text-blue-600" : "text-gray-200"} />
                ))}
              </div>

              <p className="text-gray-600 italic text-sm mb-10 leading-relaxed h-24 line-clamp-4">
                &quot;{rev.content}&quot;
              </p>

              <div className="flex items-center gap-5 pt-6 border-t border-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={rev.avatar} 
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white ring-4 ring-blue-50/50" 
                    alt={rev.name} 
                />
                <div>
                  <h4 className="font-black text-blue-900 uppercase text-xs italic tracking-tight">{rev.name}</h4>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">{rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}