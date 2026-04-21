/* eslint-disable */
// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    if (!location || !startDate || !endDate) {
      alert("Vui lòng nhập đầy đủ thông tin tìm kiếm!");
      return;
    }
    // Chuyển hướng sang trang danh sách xe với các tham số tìm kiếm
    router.push(`/cars?location=${location}&start=${startDate}&end=${endDate}`);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-5xl mx-auto -mt-12 relative z-10 flex flex-col md:flex-row gap-4 items-end">
      {/* Địa điểm */}
      <div className="flex-1 w-full">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Địa điểm</label>
        <div className="flex items-center bg-gray-50 rounded-2xl p-3 border border-gray-100 focus-within:border-blue-500 transition-all">
          <MapPin size={18} className="text-blue-600 mr-2" />
          <input 
            type="text" 
            placeholder="Bạn muốn tìm xe khu vực nào ?" 
            className="bg-transparent outline-none w-full font-bold text-gray-700"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Ngày bắt đầu */}
      <div className="w-full md:w-48">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Bắt đầu</label>
        <div className="flex items-center bg-gray-50 rounded-2xl p-3 border border-gray-100 focus-within:border-blue-500 transition-all">
          <Calendar size={18} className="text-blue-600 mr-2" />
          <input 
            type="date" 
            className="bg-transparent outline-none w-full font-bold text-gray-700 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </div>

      {/* Ngày kết thúc */}
      <div className="w-full md:w-48">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Kết thúc</label>
        <div className="flex items-center bg-gray-50 rounded-2xl p-3 border border-gray-100 focus-within:border-blue-500 transition-all">
          <Calendar size={18} className="text-blue-600 mr-2" />
          <input 
            type="date" 
            className="bg-transparent outline-none w-full font-bold text-gray-700 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Nút tìm kiếm */}
      <button 
        onClick={handleSearch}
        className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
      >
        <Search size={20} /> TÌM XE
      </button>
    </div>
  );
}