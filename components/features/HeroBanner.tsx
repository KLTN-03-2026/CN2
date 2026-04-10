"use client"; // Bắt buộc vì có sử dụng State và Effect (Logic động)

import { useState, useEffect } from "react";

// Danh sách ảnh nền (Bạn có thể thay bằng link ảnh khác nếu muốn)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", // Ảnh du lịch đường trường
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop", // Ảnh lái xe vô lăng
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop", // Ảnh xe thể thao
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", // Ảnh phong cảnh thiên nhiên
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logic tự động chuyển ảnh sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // 5000ms = 5 giây

    return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
  }, []);

  return (
    <section className="relative h-[550px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      
      {/* === PHẦN ẢNH NỀN (SLIDESHOW) === */}
      {HERO_IMAGES.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Ảnh */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Lớp phủ màu đen (Overlay) để chữ dễ đọc hơn */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}

      {/* === PHẦN NỘI DUNG CHỮ (Nổi lên trên) === */}
      <div className="relative z-10 -mt-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          Vi vu mọi nẻo đường cùng <span className="text-blue-400">ViVuCar</span>
        </h1>
        <p className="text-gray-100 text-lg md:text-2xl font-light drop-shadow-md">
          Nền tảng thuê xe tự lái uy tín hàng đầu Việt Nam. <br className="hidden md:block"/>
          Trải nghiệm xe mới, giá tốt ngay hôm nay.
        </p>
      </div>

    </section>  
  );
}