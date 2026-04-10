/* eslint-disable */
// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

// 🚀 BẢN ĐỒ LOGO: Khớp tên hãng từ Database với Link ảnh Logo tương ứng
// Tôi đã thay các đoạn base64 dài bằng link ảnh URL cho nhẹ web
const LOGO_MAP = {
  "VinFast": "https://www.carlogos.org/car-logos/vinfast-logo.png",
  "Toyota": "https://www.carlogos.org/car-logos/toyota-logo.png",
  "Hyundai": "https://www.carlogos.org/car-logos/hyundai-logo.png",
  "Ford": "https://www.carlogos.org/car-logos/ford-logo.png",
  "Mitsubishi": "https://www.carlogos.org/car-logos/mitsubishi-logo.png",
  "Kia": "https://www.carlogos.org/car-logos/kia-logo.png",
  "Mazda": "https://www.carlogos.org/car-logos/mazda-logo.png",
  "Honda": "https://www.carlogos.org/car-logos/honda-logo.png",
  "Subaru": "https://www.carlogos.org/car-logos/subaru-logo.png",
  "Mercedes": "https://www.carlogos.org/car-logos/mercedes-benz-logo.png",
  "BMW": "https://www.carlogos.org/car-logos/bmw-logo.png",
  "Audi": "https://www.carlogos.org/car-logos/audi-logo.png",
  "Porsche": "https://www.carlogos.org/car-logos/porsche-logo.png",
  "Suzuki": "https://www.carlogos.org/car-logos/suzuki-logo.png",
  "Nissan": "https://www.carlogos.org/car-logos/nissan-logo.png",
  "Lexus": "https://www.carlogos.org/car-logos/lexus-logo.png",
  "Volkswagen": "https://www.carlogos.org/car-logos/volkswagen-logo.png",
  "MG": "https://www.carlogos.org/car-logos/mg-logo.png",
  "LandRover": "https://www.carlogos.org/car-logos/land-rover-logo.png",
  "Peugeot": "https://www.carlogos.org/car-logos/peugeot-logo.png",
  "Volvo": "https://www.carlogos.org/car-logos/volvo-logo.png",
  "Chevrolet": "https://www.carlogos.org/car-logos/chevrolet-logo.png",
  "BYD": "https://www.carlogos.org/car-logos/byd-logo.png",
};

// 🚀 QUAN TRỌNG: Nhận `brands` từ file page.tsx truyền vào
export default function BrandList({ brands = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Lấy 8 hãng đầu tiên nếu chưa mở rộng, nếu mở rộng thì lấy tất cả hãng từ Database
  const visibleBrands = isExpanded ? brands : brands.slice(0, 8);

  return (
    <section className="container mx-auto px-4 py-20">
      {/* HEADER ĐỒNG BỘ */}
      <div className="flex items-end justify-between mb-10 border-l-4 border-blue-600 pl-5">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">
            Thương hiệu phổ biến
          </h2>
          <p className="text-gray-400 font-bold mt-2 text-xs md:text-sm tracking-widest uppercase">
            {brands.length} hãng xe đang sẵn sàng phục vụ bạn
          </p>
        </div>
        
        {/* CHỈ HIỆN NÚT NÀY NẾU DATABASE CÓ HƠN 8 HÃNG */}
        {brands.length > 8 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest border-b-2 border-blue-600 pb-1 hover:text-blue-800 transition-all"
          >
            {isExpanded ? (
              <>Thu gọn <ChevronUp size={14} /></>
            ) : (
              <>Xem tất cả hãng <ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>

      {/* GRID DANH SÁCH HÃNG XE ĐỘNG */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 transition-all duration-500 ease-in-out">
        {visibleBrands.map((item) => {
          const brandName = item.brand;           // Tên hãng từ DB
          const carCount = item._count.brand;     // Số lượng xe từ DB
          const logoUrl = LOGO_MAP[brandName];    // Tìm logo dựa trên tên hãng

          return (
            <Link 
              key={brandName}
              href={`/cars?brand=${brandName}`}
              className="group flex flex-col items-center justify-center p-8 bg-white rounded-[32px] border border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-4 filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={brandName} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => e.currentTarget.src = `https://placehold.co/100x100?text=${brandName}`}
                  />
                ) : (
                  // Nếu hãng lạ chưa có trong LOGO_MAP, tự động tạo Logo bằng chữ cái đầu
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-black text-blue-900 italic">
                    {brandName.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-900 uppercase tracking-widest text-center">
                {brandName}
              </span>
              <span className="text-[8px] font-bold text-blue-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {carCount} xe
              </span>
            </Link>
          );
        })}
      </div>

      {/* HIỆU ỨNG ĐỔ BÓNG VÀ CHỮ THÔNG BÁO KHI ĐANG THU GỌN */}
      {!isExpanded && brands.length > 8 && (
        <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
              Và còn {brands.length - 8} thương hiệu khác...
            </p>
        </div>
      )}
    </section>
  );
}