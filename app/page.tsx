/* eslint-disable */
// @ts-nocheck
import prisma from "@/lib/prisma"; 
import HeroBanner from "@/components/features/HeroBanner";
import SearchWidget from "@/components/features/SearchWidget";
import CarSection from "@/components/features/CarSection";
import BrandList from "@/components/features/BrandList";
import LocationList from "@/components/features/LocationList";
import ReviewSection from "@/components/features/ReviewSection";
import FaqSection from "@/components/features/FaqSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; 

export default async function Home() {
  let cars = [];
  let locationStats = []; 
  let brandStats = [];

  try {
    // 1. Lấy 8 xe mới nhất cho trang chủ (ĐÃ BỊT LỖ HỔNG)
    cars = await prisma.car.findMany({
      where: {
        status: "APPROVED" // Chỉ hiện xe đã duyệt
      },
      take: 8,
      orderBy: { id: 'desc' }, 
    });

    // 2. THỐNG KÊ SỐ LƯỢNG XE THEO ĐỊA ĐIỂM (ĐÃ BỊT LỖ HỔNG)
    locationStats = await prisma.car.groupBy({
      by: ['location'],
      where: {
        status: "APPROVED" // Chỉ hiện xe đã duyệt
      },
      _count: {
        location: true
      }
    });

    // 3. LẤY TOÀN BỘ HÃNG XE ĐANG CÓ TRONG DATABASE (ĐÃ BỊT LỖ HỔNG)
    brandStats = await prisma.car.groupBy({
      by: ['brand'],
      where: {
        status: "APPROVED" // Chỉ hiện xe đã duyệt
      },
      _count: { brand: true },
      orderBy: { _count: { brand: 'desc' } } 
    });

  } catch (error) {
    console.error("Lỗi kết nối Database:", error);
    cars = []; 
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* KHỐI 1: BANNER & SEARCH */}
      <div className="relative z-[50]"> 
         <HeroBanner />
         <div className="-mt-24 relative z-[60] px-4"> 
            <SearchWidget />
         </div>
      </div>

      {/* KHỐI 2: NỘI DUNG CHÍNH */}
      <div className="container mx-auto px-4 mt-24 space-y-32 relative z-[10]">
        
        {/* PHẦN 1: XE NỔI BẬT */}
        <div id="car-section" className="scroll-mt-24">
           <CarSection 
             title="Xe Nổi Bật" 
             subTitle="Khám phá những mẫu xe đời mới nhất đang sẵn sàng phục vụ bạn"
             cars={cars} 
             showFilters={false} 
           />

           <div className="flex justify-center mt-12">
             <Link 
               href="/cars" 
               className="group flex items-center gap-3 bg-white border-2 border-blue-600 text-blue-600 px-12 py-4 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-50 active:scale-95"
             >
               Xem toàn bộ xe rảnh
               <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
             </Link>
           </div>
        </div>

        {/* 🚀 PHẦN 2: CHỌN XE THEO HÃNG */}
        {/* 🚀 PHẦN 2: CHỌN XE THEO HÃNG */}
        <div id="brand-section" className="scroll-mt-32">
            <BrandList brands={brandStats} />
        </div>

        {/* PHẦN 3: CÁC ĐỊA ĐIỂM NỔI BẬT */}
        <div id="location-section" className="scroll-mt-32">
           <LocationList stats={locationStats} />
        </div>

        {/* PHẦN 4: ĐÁNH GIÁ & HỎI ĐÁP */}
        <div className="pt-10">
           <ReviewSection />
        </div>
        
        <div className="pb-10">
           <FaqSection />
        </div>
        
      </div>
      
    </main>
  );
}