/* eslint-disable */
// @ts-nocheck
import prisma from "@/lib/prisma";
import CarSection from "@/components/features/CarSection";
import LiveSearchBar from "@/components/features/LiveSearchBar";
import { 
  CarFront, Calendar, MapPin, SearchX, 
  RotateCcw, Filter, ChevronRight, Users,
  Search // 🚀 1. Bổ sung icon Search
} from "lucide-react";
import Link from "next/link";
import { POPULAR_LOCATIONS } from "@/constants/data"; 

const LOCATIONS_UI = [
  { id: 1, name: "Hà Nội", value: "HaNoi", image: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "TP. Hồ Chí Minh", value: "TPHCM", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Đà Nẵng", value: "DaNang", image: "https://tse1.mm.bing.net/th/id/OIP.n5fK4T2uUlwaSnrgalc0VgHaEa?pid=Api&h=220&P=0" },
  { id: 4, name: "Nha Trang", value: "NhaTrang", image: "https://tse3.mm.bing.net/th/id/OIP.Px1X0sb11NT1QtTXJu88pgHaE8?pid=Api&h=220&P=0" },
  { id: 5, name: "Phú Quốc", value: "PhuQuoc", image: "https://tse1.mm.bing.net/th/id/OIP.yukIsevD2C6LUuO-cmNyZQHaEK?pid=Api&h=220&P=0" },
  { id: 6, name: "Đà Lạt", value: "DaLat", image: "https://tse1.mm.bing.net/th/id/OIP.5zDQ4NXe8MNybDiPy7i0tgHaEF?pid=Api&h=220&P=0" },
  { id: 7, name: "Hạ Long", value: "HaLong", image: "https://tse1.mm.bing.net/th/id/OIP.RgYQk8GdgfPFtpo7geQaXwHaEs?pid=Api&h=220&P=0" },
  { id: 8, name: "Vũng Tàu", value: "VungTau", image: "https://tse2.mm.bing.net/th/id/OIP.KhLAmur6GEnSxSm-KXTWuwHaDF?pid=Api&h=220&P=0" },
  { id: 9, name: "Cần Thơ", value: "CanTho", image: "https://tse4.mm.bing.net/th/id/OIP.DfJTFJM7PINKQ7mPKlNDSwHaEW?pid=Api&h=220&P=0" },
  { id: 10, name: "Hội An", value: "HoiAn", image: "https://tse2.mm.bing.net/th/id/OIP.KNPIC3tvqATw21GSA0TYcAHaFH?pid=Api&h=220&P=0" },
  { id: 11, name: "Huế", value: "Hue", image: "https://tse3.mm.bing.net/th/id/OIP.SxSOiojAfquSc6IxngPYQwHaEK?pid=Api&h=220&P=0" },
  { id: 12, name: "Quy Nhơn", value: "QuyNhon", image: "https://tse3.mm.bing.net/th/id/OIP.leS44AYPbc5zpOLwu_2WcAHaFj?pid=Api&h=220&P=0" },
];

export default async function CarsPage({ searchParams }) {
  const params = await searchParams;
  const locationSearch = params.location || ""; 
  const brandSearch = params.brand || "";       
  const seatsSearch = params.seats || "";
  const nameSearch = params.name || ""; // 🚀 2. Nhận tham số tìm kiếm tên xe
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

  if (seatsSearch && seatsSearch !== "") {
    whereCondition.seats = parseInt(seatsSearch, 10); 
  }

  // 🚀 3. Logic tìm kiếm tên xe (Không phân biệt chữ hoa/chữ thường)
  if (nameSearch && nameSearch.trim() !== "") {
    whereCondition.name = {
      contains: nameSearch.trim(),
      mode: "insensitive" // Cho phép gõ "mazda" vẫn tìm ra "Mazda" (chỉ chạy trên PostgreSQL/MongoDB)
    };
  }

  // THUẬT TOÁN LỌC LỊCH TRÌNH "THÉP"
  if (startDateStr && endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      whereCondition.bookings = {
        none: {
          status: { in: ["PENDING", "CONFIRMED"] },
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } }
          ]
        }
      };

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
        <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start lg:items-center gap-6 flex-1 w-full">
            <div className="w-16 h-16 bg-blue-600 rounded-[24px] items-center justify-center text-white shadow-xl rotate-3 shrink-0 hidden sm:flex">
              <Filter size={32} />
            </div>
            
            <div className="w-full">
              <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter leading-none mb-3">
                {brandSearch ? `Xe ${brandSearch}` : (locationSearch ? `Xe tại ${locationLabel}` : "Tất cả dòng xe")}
              </h1>
              
              {/* Các Tags bộ lọc hiện tại */}
              <div className="flex flex-wrap gap-2 mb-4">
                {locationSearch && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-100 italic">
                    <MapPin size={12}/> {locationLabel}
                  </span>
                )}
                {brandSearch && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded-full border border-purple-100 italic">
                    <CarFront size={12}/> {brandSearch}
                  </span>
                )}
                {seatsSearch && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded-full border border-orange-100 italic">
                    <Users size={12}/> {seatsSearch} Chỗ
                  </span>
                )}
                {startDateStr && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100 italic">
                    <Calendar size={12}/> {new Date(startDateStr).toLocaleDateString('vi-VN')} - {new Date(endDateStr).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>

             {/* 🚀 4. THANH TÌM KIẾM NHANH TÊN XE (GÕ TỚI ĐÂU LỌC TỚI ĐÓ) */}
             <LiveSearchBar />

            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
            <div className="px-8 py-4 bg-blue-900 text-white font-black rounded-2xl text-[10px] uppercase italic tracking-[0.2em] shadow-lg w-full lg:w-auto text-center">
              Tìm thấy {cars.length} lựa chọn
            </div>
            
            {(locationSearch || brandSearch || startDateStr || seatsSearch || nameSearch) && (
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
                Không tìm thấy xe {brandSearch} {nameSearch ? `"${nameSearch}"` : ""} {seatsSearch ? `${seatsSearch} chỗ` : ""} {locationSearch ? `tại ${locationLabel}` : ""}
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-0 max-w-md mx-auto italic">
                Rất tiếc! Thời gian này các xe đã được đặt hết hoặc không có xe phù hợp. Bạn có thể thử tìm kiếm tên khác hoặc xem các khu vực lân cận dưới đây:
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {LOCATIONS_UI.map((loc) => (
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
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Khám phá ngay</p>
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