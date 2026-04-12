/* eslint-disable */
// @ts-nocheck
import prisma from "@/lib/prisma";
import CarSection from "@/components/features/CarSection";
import { 
  CarFront, Calendar, MapPin, SearchX, 
  RotateCcw, Filter, ChevronRight, Users // 🚀 Thêm icon Users cho số chỗ
} from "lucide-react";
import Link from "next/link";
import { POPULAR_LOCATIONS, LOCATIONS } from "@/constants/data"; 

export default async function CarsPage({ searchParams }) {
  const params = await searchParams;
  const locationSearch = params.location || ""; 
  const brandSearch = params.brand || "";       
  const seatsSearch = params.seats || ""; // 🚀 1. LẤY THAM SỐ SỐ CHỖ TỪ URL
  const startDateStr = params.start;
  const endDateStr = params.end;

  let whereCondition: any = {
    status: "APPROVED" 
  };

  if (locationSearch && locationSearch !== "") {
    whereCondition.location = locationSearch; 
  }
  
  if (brandSearch && brandSearch !== "") {
    whereCondition.brand = brandSearch;
  }

  // 🚀 2. THÊM ĐIỀU KIỆN LỌC THEO SỐ CHỖ VÀO PRISMA
  if (seatsSearch && seatsSearch !== "") {
    whereCondition.seats = parseInt(seatsSearch, 10); // Chuyển chuỗi thành số nguyên
  }

  // THUẬT TOÁN LỌC LỊCH TRÌNH "THÉP"
  if (startDateStr && endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      // Loại bỏ xe đang có đơn thuê
      whereCondition.bookings = {
        none: {
          status: { in: ["PENDING", "CONFIRMED"] },
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } }
          ]
        }
      };

      // Loại bỏ xe bị khóa lịch
      whereCondition.blockedDates = {
        none: {
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } }
          ]
        }
      };
    }
  }

  let cars = [];
  try {
    cars = await prisma.car.findMany({
      where: whereCondition,
      orderBy: { id: 'desc' }, 
    });
  } catch (error) {
    console.error("LỖI DATABASE TẠI CARS PAGE:", error);
  }

  const locationObj = POPULAR_LOCATIONS.find(l => l.value === locationSearch);
  const locationLabel = locationObj ? locationObj.label : "Toàn quốc";

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-32 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* BẢNG TÓM TẮT BỘ LỌC */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
              <Filter size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter leading-none mb-3">
                {brandSearch ? `Xe ${brandSearch}` : (locationSearch ? `Xe tại ${locationLabel}` : "Tất cả dòng xe")}
              </h1>
              <div className="flex flex-wrap gap-3">
                {locationSearch && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-100 italic">
                    <MapPin size={12}/> {locationLabel}
                  </span>
                )}
                {brandSearch && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded-full border border-purple-100 italic">
                    <CarFront size={12}/> {brandSearch}
                  </span>
                )}
                {/* 🚀 3. HIỂN THỊ TAG SỐ CHỖ TRÊN GIAO DIỆN */}
                {seatsSearch && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded-full border border-orange-100 italic">
                    <Users size={12}/> {seatsSearch} Chỗ
                  </span>
                )}
                {startDateStr && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100 italic">
                    <Calendar size={12}/> {new Date(startDateStr).toLocaleDateString('vi-VN')} - {new Date(endDateStr).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
            <div className="px-8 py-4 bg-blue-900 text-white font-black rounded-2xl text-[10px] uppercase italic tracking-[0.2em] shadow-lg w-full lg:w-auto text-center">
              Tìm thấy {cars.length} lựa chọn
            </div>
            
            {/* 🚀 Bổ sung seatsSearch vào điều kiện Xóa bộ lọc */}
            {(locationSearch || brandSearch || startDateStr || seatsSearch) && (
              <Link 
                href="/cars" 
                className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-2 hover:text-blue-600 transition-all group"
              >
                <RotateCcw size={12} className="group-hover:rotate-[-45deg] transition-transform"/> 
                Xóa bộ lọc
              </Link>
            )}
          </div>
        </div>

        {/* PHẦN HIỂN THỊ KẾT QUẢ */}
        {cars.length > 0 ? (
          <CarSection cars={cars} />
        ) : (
          <div className="space-y-12">
            <div className="bg-white rounded-[50px] p-16 text-center border-2 border-dashed border-gray-100">
              <SearchX size={56} className="mx-auto text-gray-200 mb-6" />
              <h2 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mb-4">
                Không tìm thấy xe {brandSearch} {seatsSearch ? `${seatsSearch} chỗ` : ""} {locationSearch ? `tại ${locationLabel}` : ""}
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-0 max-w-md mx-auto italic">
                Rất tiếc! Thời gian này các xe đã được đặt hết. Bạn có thể thử tìm kiếm vào ngày khác hoặc xem các khu vực lân cận dưới đây:
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {LOCATIONS.map((loc) => (
                <Link 
                  key={loc.id}
                  href={`/cars?location=${loc.value}`}
                  className="group bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm hover:border-blue-600 hover:shadow-xl transition-all flex flex-col items-center text-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-50 group-hover:border-blue-100 transition-all">
                    <img src={loc.image} className="w-full h-full object-cover" alt={loc.name} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-blue-900 uppercase italic leading-none group-hover:text-blue-600 transition-colors">{loc.name}</h4>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{loc.carCount}+ XE</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center pt-8">
                <Link href="/cars" className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 hover:text-blue-600 italic underline decoration-2 underline-offset-4">
                    Hoặc xem tất cả xe trên toàn quốc <ChevronRight size={14}/>
                </Link>
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}