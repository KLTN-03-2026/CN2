/* eslint-disable */
// @ts-nocheck
"use client"; 

import { useState, useEffect } from "react";
import { Sparkles, MapPin } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", 
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <section className="relative h-[600px] flex flex-col items-center justify-center text-center px-4 overflow-hidden font-sans bg-black">
      
      {/* ẢNH NỀN VỚI LỚP PHỦ ĐEN MỜ */}
      {HERO_IMAGES.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <img
            src={img}
            alt="ViVu Car Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Lớp phủ đen tĩnh tại, mộc mạc và sang trọng */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}

      {/* NỘI DUNG CHỮ */}
      <div className="relative z-20 -mt-16 max-w-5xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-black mb-8">
          <Sparkles size={14} className="text-blue-300" />
          Nền tảng thuê xe tự lái uy tín
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6 drop-shadow-lg">
          Vi vu mọi nẻo đường <br className="hidden md:block" />
          cùng <span className="text-blue-400">ViVuCar</span>
        </h1>
        
        <p className="text-gray-200 text-sm md:text-lg lg:text-xl font-medium max-w-2xl mx-auto drop-shadow-md mb-8">
          Hàng ngàn dòng xe đời mới đang chờ bạn. Trải nghiệm dịch vụ thuê xe không cọc, giao xe tận nơi với mức giá tốt nhất ngay hôm nay.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-white/80 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-400"/> Phủ sóng khắp các địa điểm du lịch</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/50 my-auto"></span>
            <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-blue-400"/> Bảo hiểm 2 chiều</span>
        </div>

      </div>
    </section>  
  );
}