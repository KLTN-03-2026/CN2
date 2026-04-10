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
    <section className="mt-24 mb-24 max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white mb-6 shadow-xl rotate-3">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-2 leading-none">
          Câu hỏi thường gặp
        </h2>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
            Giải đáp mọi thắc mắc trước khi bạn khởi hành
        </p>
      </div>
      
      <div className="space-y-4">
        {FAQS.map((faq) => (
          <div key={faq.id} className={`bg-white rounded-[28px] border transition-all duration-300 overflow-hidden ${openId === faq.id ? "shadow-lg border-blue-200 ring-1 ring-blue-50" : "border-gray-100 hover:border-blue-100 shadow-sm"}`}>
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex items-center justify-between p-7 text-left transition-colors"
            >
              <span className={`font-black uppercase italic text-sm tracking-tight transition-colors ${openId === faq.id ? "text-blue-600" : "text-blue-900"}`}>
                {faq.question}
              </span>
              <ChevronDown className={`transition-transform duration-500 ${openId === faq.id ? "rotate-180 text-blue-600" : "text-gray-300"}`} size={20} />
            </button>

            {openId === faq.id && (
              <div className="p-7 pt-0 animate-in slide-in-from-top-2 duration-300">
                <div className="h-[2px] w-12 bg-blue-50 mb-5 rounded-full" />
                <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}