/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState } from "react";

export default function CarAnimation({ onComplete }) {
  const [start, setStart] = useState(false);

  useEffect(() => {
    setStart(true);
    // Sau 2 giây (khi xe chạy xong) thì gọi hàm kết thúc
    const timer = setTimeout(() => {
        onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 flex items-center justify-center overflow-hidden">
        {/* Chiếc xe */}
        <div 
            className={`absolute bottom-1/2 w-48 transition-all duration-[2000ms] ease-in-out transform ${start ? "translate-x-[150vw]" : "-translate-x-[150vw]"}`}
        >
            <img src="https://cdn-icons-png.flaticon.com/512/3097/3097180.png" alt="Car" className="w-full" />
            <div className="text-center font-bold text-blue-600 mt-2 whitespace-nowrap bg-white px-2 rounded-full shadow-lg">Đang đăng nhập...</div>
        </div>
        
        {/* Vệt gió (Trang trí) */}
        <div className={`absolute bottom-1/2 h-1 bg-gray-200 w-full transition-opacity duration-500 ${start ? "opacity-0" : "opacity-50"}`}></div>
    </div>
  );
}