/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react"; // Thêm useState và useEffect
import Link from "next/link";
import { Users, Settings, Fuel, MapPin } from "lucide-react";

export default function CarCard({ car }) {
  // 1. CHỐNG LỖI HYDRATION: Kiểm tra component đã hiển thị trên trình duyệt chưa
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Logic tính toán phần trăm giảm giá
  const hasDiscount = car.priceOriginal > car.priceDiscount;
  const discountPercentage = hasDiscount 
    ? Math.round(((car.priceOriginal - car.priceDiscount) / car.priceOriginal) * 100)
    : 0;

  // 2. HÀM ĐỊNH DẠNG TIỀN TỆ: Ép buộc dùng chuẩn Việt Nam để đồng bộ Server/Client
  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Nếu chưa mounted, trả về một khung trống (hoặc skeleton) để tránh lỗi lệch nội dung
  if (!mounted) return <div className="min-h-[400px] bg-gray-50 rounded-[32px] animate-pulse" />;

  return (
    <Link 
      href={`/cars/${car.id}`} 
      className="bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group relative block"
    >
      
      {/* Badge giảm giá động */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg animate-pulse uppercase italic">
          GIẢM {discountPercentage}%
        </div>
      )}

      {/* Hình ảnh xe */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={car.image} 
          alt={car.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800"}
        />
      </div>

      {/* Nội dung chi tiết */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-black text-blue-900 line-clamp-1 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors leading-tight">
            {car.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-400 mt-1">
            <MapPin size={12} className="text-red-400" />
            {/* Hiển thị địa điểm - Nên map sang nhãn tiếng Việt nếu cần */}
            <span className="text-[10px] font-bold uppercase tracking-widest">{car.location}</span>
          </div>
        </div>

        {/* Thông số kỹ thuật */}
        <div className="grid grid-cols-3 gap-2 border-y border-gray-50 py-4 mb-4 text-center">
          <div className="flex flex-col items-center gap-1 border-r border-gray-100">
            <Users size={14} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{car.seats} chỗ</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-gray-100">
            <Settings size={14} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                {car.transmission === "Automatic" ? "Tự động" : "Số sàn"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel size={14} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                {car.fuel === "Gasoline" ? "Xăng" : car.fuel === "Diesel" ? "Dầu" : "Điện"}
            </span>
          </div>
        </div>

        {/* Giá tiền và Nút bấm */}
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount && (
              <p className="text-gray-400 text-[10px] line-through font-bold">
                {formatVND(car.priceOriginal)}đ
              </p>
            )}
            <p className="text-blue-600 font-black text-xl italic tracking-tighter">
              {formatVND(car.priceDiscount)}đ
              <span className="text-[10px] text-gray-400 font-bold lowercase not-italic ml-1">/ngày</span>
            </p>
          </div>
          
          <div className="bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-all uppercase italic tracking-tighter shadow-sm">
            Chọn xe
          </div>
        </div>
      </div>
    </Link>
  );
}