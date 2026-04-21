/* eslint-disable */
// @ts-nocheck
import prisma from "@/lib/prisma"; 
import HeroBanner from "@/components/features/HeroBanner";
import SearchWidget from "@/components/features/SearchWidget";
import CarSection from "@/components/features/CarSection";
import BrandList from "@/components/features/BrandList";
import LocationList from "@/components/features/LocationList";
import HomeReviews from "@/components/features/HomeReviews";
import FaqSection from "@/components/features/FaqSection";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react"; 

export default async function Home() {
  let cars = [];
  let locationStats = []; 
  let brandStats = [];

  try {
    // 1. Lấy 8 xe mới nhất cho trang chủ
    cars = await prisma.car.findMany({
      where: {
        status: "APPROVED" 
      },
      take: 8,
      orderBy: { id: 'desc' }, 
    });

    // 2. THỐNG KÊ SỐ LƯỢNG XE THEO ĐỊA ĐIỂM
    locationStats = await prisma.car.groupBy({
      by: ['location'],
      where: {
        status: "APPROVED" 
      },
      _count: {
        location: true
      }
    });

    // 3. LẤY TOÀN BỘ HÃNG XE ĐANG CÓ TRONG DATABASE
    brandStats = await prisma.car.groupBy({
      by: ['brand'],
      where: {
        status: "APPROVED" 
      },
      _count: { brand: true },
      orderBy: { _count: { brand: 'desc' } } 
    });

  } catch (error) {
    console.error("Lỗi kết nối Database:", error);
    cars = []; 
  }

  return (
    // 🌟 1. NÂNG CẤP NỀN TỔNG THỂ: Thêm gradient và overflow-hidden để chứa các đốm sáng
    <main className="relative min-h-screen bg-slate-50 font-sans pb-20 overflow-x-hidden">
      
      
      
      {/* KHỐI 1: BANNER & SEARCH */}
      <div className="relative z-[50]"> 
         <HeroBanner />
         <div className="-mt-24 relative z-[60] px-4 max-w-7xl mx-auto"> 
            <SearchWidget />
         </div>
      </div>

      {/* KHỐI 2: NỘI DUNG CHÍNH */}
      {/* Thêm z-10 để nội dung luôn nổi lên trên lớp ánh sáng nền */}
      <div className="container mx-auto px-4 mt-24 space-y-32 relative z-[10] max-w-7xl">
        
        {/* PHẦN 1: XE NỔI BẬT */}
        <div id="car-section" className="scroll-mt-24 relative">
           <CarSection 
             title="Xe Nổi Bật" 
             subTitle="Khám phá những mẫu xe đời mới nhất đang sẵn sàng phục vụ bạn"
             cars={cars} 
             showFilters={false} 
           />

           {/* 🌟 3. NÂNG CẤP NÚT CTA XEM TẤT CẢ XE */}
           <div className="flex justify-center mt-16 relative z-20">
             <Link 
               href="/cars" 
               className="group relative flex items-center gap-3 bg-white text-blue-900 px-10 py-5 rounded-full font-black uppercase italic tracking-tighter hover:text-white transition-all duration-500 overflow-hidden shadow-2xl shadow-blue-900/10 hover:shadow-blue-600/30 active:scale-95 border border-white hover:border-transparent"
             >
               {/* Lớp nền xanh trượt từ dưới lên khi hover */}
               <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-10"></span>
               
               <Sparkles size={20} className="text-blue-500 group-hover:text-blue-200 transition-colors" />
               <span className="relative z-10 text-lg">Xem toàn bộ xe rảnh</span>
               <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform relative z-10" />
             </Link>
           </div>
        </div>

        {/* PHẦN 2: CHỌN XE THEO HÃNG */}
        <div id="brand-section" className="scroll-mt-32">
            <BrandList brands={brandStats} />
        </div>

        {/* PHẦN 3: CÁC ĐỊA ĐIỂM NỔI BẬT */}
        <div id="location-section" className="scroll-mt-32">
           <LocationList stats={locationStats} />
        </div>

        {/* PHẦN 4: ĐÁNH GIÁ & HỎI ĐÁP */}
        <div className="pt-10">
           <HomeReviews />
        </div>
        
        <div className="pb-10">
           <FaqSection />
        </div>
        
      </div>
      
    </main>
  );
}