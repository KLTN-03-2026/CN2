/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, CalendarClock } from "lucide-react";
import { POPULAR_LOCATIONS } from "@/constants/data"; 

export default function SearchWidget() {
  const router = useRouter();
  
  const [locationLabel, setLocationLabel] = useState(""); // Hiển thị: "Hà Nội"
  const [locationValue, setLocationValue] = useState(""); // Gửi API: "HaNoi"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

 // 1. Khai báo state ban đầu là chuỗi rỗng (để lúc Server render và Client render lần 1 giống y hệt nhau -> Không báo lỗi)
 const [minDateTime, setMinDateTime] = useState("");

 // 2. Chạy useEffect: Chờ giao diện load xong xuôi rồi mới cập nhật giờ
 useEffect(() => {
   const now = new Date();
   
   // 💡 Tặng Khoa thêm 1 mẹo nhỏ: 
   // Hàm toISOString() mặc định sẽ lấy giờ quốc tế (UTC). Nếu Khoa muốn input 
   // chặn đúng theo giờ Việt Nam, thì phải trừ đi độ lệch múi giờ (TimezoneOffset)
   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
   
   // Cập nhật lại state với định dạng YYYY-MM-DDThh:mm
   setMinDateTime(now.toISOString().slice(0, 16));
 }, []);

  // 2. LOGIC TÌM KIẾM ĐỊA ĐIỂM
  const filteredLocations = useMemo(() => {
    if (!locationLabel) return POPULAR_LOCATIONS;
    return POPULAR_LOCATIONS.filter((loc) =>
      loc.label.toLowerCase().includes(locationLabel.toLowerCase())
    );
  }, [locationLabel]);

  const handleSearch = () => {
    // Nếu khách gõ tay mà không chọn từ Dropdown, cố gắng khớp dữ liệu
    let finalLocation = locationValue;
    if (!finalLocation && locationLabel) {
      const match = POPULAR_LOCATIONS.find(l => l.label.toLowerCase() === locationLabel.toLowerCase());
      if (match) finalLocation = match.value;
    }

    if (!finalLocation || !startDate || !endDate) {
      alert("Vui lòng chọn Địa điểm từ danh sách và nhập đầy đủ ngày giờ!");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert("Ngày trả xe phải sau ngày nhận xe!");
      return;
    }

    const params = new URLSearchParams({
      location: finalLocation, // Gửi Enum Key (ví dụ: HaNoi)
      start: startDate,
      end: endDate
    });

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 max-w-5xl mx-auto relative z-40 -mt-12">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        
        {/* === Ô ĐỊA ĐIỂM === */}
        <div className="md:col-span-4 relative">
          <div className="border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 flex flex-col justify-center h-full focus-within:border-blue-500 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} className="text-blue-600" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Vị trí của bạn</span>
            </div>
            <input
              type="text"
              value={locationLabel}
              onChange={(e) => {
                setLocationLabel(e.target.value);
                setLocationValue(""); // Reset value nếu khách đang gõ
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Bạn muốn đi đâu?"
              className="w-full bg-transparent outline-none font-black text-blue-900 placeholder:text-gray-300 italic"
            />
          </div>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl mt-2 max-h-64 overflow-y-auto z-[100] p-2 scrollbar-hide animate-in slide-in-from-top-2">
                 {filteredLocations.length > 0 ? (
                   filteredLocations.map((loc, i) => (
                    <div 
                      key={i} 
                      onClick={() => { 
                        setLocationLabel(loc.label); 
                        setLocationValue(loc.value); 
                        setShowDropdown(false); 
                      }} 
                      className="p-4 hover:bg-blue-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors group"
                    >
                      <MapPin size={14} className="text-gray-300 group-hover:text-blue-600" />
                      <span className="font-bold text-sm text-gray-600 group-hover:text-blue-900">{loc.label}</span>
                    </div>
                  ))
                 ) : (
                   <div className="p-4 text-xs font-black text-gray-400 uppercase italic text-center">Không tìm thấy địa điểm</div>
                 )}
              </div>
            </>
          )}
        </div>

        {/* === Ô NGÀY BẮT ĐẦU === */}
        <div className="md:col-span-2 border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus-within:border-blue-500 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ngày nhận</span>
          </div>
          <input 
            type="datetime-local"
            min={minDateTime}
            className="w-full bg-transparent outline-none font-black text-blue-900 text-xs cursor-pointer"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* === Ô NGÀY KẾT THÚC === */}
        <div className="md:col-span-2 border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus-within:border-blue-500 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ngày trả</span>
          </div>
          <input 
            type="datetime-local" 
            min={startDate || minDateTime}
            className="w-full bg-transparent outline-none font-black text-blue-900 text-xs cursor-pointer"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* === NÚT TÌM === */}
        <div className="md:col-span-2">
          <button 
            onClick={handleSearch} 
            className="w-full h-full bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95 flex items-center justify-center gap-2 uppercase italic tracking-tighter text-lg"
          >
            <Search size={22} strokeWidth={3} /> Tìm xe
          </button>
        </div>

      </div>
    </div>
  );
}