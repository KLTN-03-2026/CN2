/* eslint-disable */
// @ts-nocheck
"use client";

import { useState } from "react";
import { FAQS } from "@/constants/data";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="mt-24 mb-32 max-w-4xl mx-auto px-4 scroll-mt-24 font-sans">
      
      {/* === HEADER === */}
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20 rotate-3 hover:rotate-0 transition-transform duration-300">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-3 leading-none">
          Câu hỏi thường gặp
        </h2>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
          Giải đáp mọi thắc mắc trước khi bạn khởi hành
        </p>
      </div>
      
      {/* === DANH SÁCH CÂU HỎI === */}
      <div className="space-y-4">
        {FAQS.map((faq) => {
          const isActive = openId === faq.id;

          return (
            <div 
              key={faq.id} 
              className={`group bg-white rounded-[24px] border transition-all duration-300 overflow-hidden relative ${
                isActive 
                  ? "shadow-md border-blue-200" 
                  : "border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Vạch kẻ xanh đánh dấu trạng thái Active */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`} 
              />

              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors"
              >
                <span className={`font-black uppercase italic text-sm md:text-base tracking-tight transition-colors pl-2 ${
                  isActive ? "text-blue-600" : "text-blue-900 group-hover:text-blue-700"
                }`}>
                  {faq.question}
                </span>
                
                {/* Vòng tròn chứa Icon mượt mà */}
                <div className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isActive 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                }`}>
                  <ChevronDown className={`transition-transform duration-500 ${isActive ? "rotate-180" : ""}`} size={18} />
                </div>
              </button>

              {/* Phần câu trả lời */}
              {isActive && (
                <div className="px-6 md:px-8 pb-8 pt-0 animate-in fade-in slide-in-from-top-4 duration-500 pl-8 md:pl-10">
                  <div className="h-[2px] w-12 bg-blue-100 mb-5 rounded-full" />
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}