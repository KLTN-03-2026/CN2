/* app/about/page.tsx */
/* eslint-disable */
// @ts-nocheck
"use client";

import { ShieldCheck, Car, Users, Trophy, Heart, Target } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    { icon: <ShieldCheck size={32}/>, title: "An toàn tuyệt đối", desc: "Mọi chiếc xe đều được kiểm định nghiêm ngặt và bảo dưỡng định kỳ trước khi giao." },
    { icon: <Car size={32}/>, title: "Đa dạng lựa chọn", desc: "Sở hữu dàn xe hơn 20 chiếc từ sedan sang trọng đến SUV mạnh mẽ cho mọi nhu cầu." },
    { icon: <Heart size={32}/>, title: "Tận tâm phục vụ", desc: "Đội ngũ hỗ trợ 24/7, luôn đồng hành cùng bạn trên mọi nẻo đường." },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* PHẦN GIỚI THIỆU CHÍNH */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-black text-blue-900 uppercase italic tracking-tighter mb-6 leading-none">
              Câu chuyện về <br/> <span className="text-blue-600">ViVuCar</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 italic font-medium">
              Ra đời từ năm 2026, ViVuCar không chỉ là một dịch vụ cho thuê xe, chúng tôi là người bạn đồng hành trong mỗi chuyến hành trình của bạn. Chúng tôi tin rằng mỗi chuyến đi đều là một kỷ niệm đáng giá.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-3xl font-black text-blue-600 italic leading-none mb-2">20+</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dòng xe cao cấp</p>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-3xl font-black text-blue-600 italic leading-none mb-2">1000+</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khách hàng tin tưởng</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-blue-600/10 rounded-[40px] rotate-3 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[40px] shadow-2xl w-full h-[500px] object-cover"
              alt="BonbonCar Story"
            />
          </div>
        </div>

        {/* GIÁ TRỊ CỐT LÕI */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Giá trị cốt lõi</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Điều làm nên sự khác biệt của chúng tôi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {values.map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-blue-900 uppercase italic mb-4 tracking-tighter">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* LỜI KÊU GỌI (CTA) */}
        <div className="bg-blue-900 rounded-[50px] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 relative z-10">Sẵn sàng cho chuyến hành trình tiếp theo?</h2>
          <Link href="/" className="inline-block bg-white text-blue-900 px-10 py-5 rounded-[20px] font-black uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-2xl relative z-10 active:scale-95">
            Đặt xe ngay bây giờ
          </Link>
        </div>

      </div>
    </main>
  );
}