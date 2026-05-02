/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CheckCircle, Calendar, MapPin, 
  ArrowRight, Home, ListOrdered, Car, Tag 
} from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      // Lấy thông tin chi tiết đơn hàng vừa đặt để hiển thị
      fetch(`/api/admin/bookings`) // Tận dụng API có sẵn hoặc tạo API riêng
        .then(res => res.json())
        .then(data => {
          const found = data.find(b => b.id === Number(bookingId));
          setBooking(found);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [bookingId]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        
        {/* ICON THÀNH CÔNG RỰC RỠ */}
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse"></div>
          <CheckCircle size={100} className="text-green-500 relative z-10 mx-auto" />
        </div>

        <h1 className="text-5xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">
          Đặt xe thành công!
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">
          Cảm ơn bạn đã tin tưởng ViVuCar v2.0
        </p>

        {/* THẺ TÓM TẮT ĐƠN HÀNG (BIÊN NHẬN) */}
        {booking && (
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden mb-12 text-left animate-in fade-in zoom-in duration-500">
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black opacity-60 uppercase">Mã đơn hàng</p>
                <p className="text-2xl font-black italic tracking-tighter">#{booking.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black opacity-60 uppercase">Trạng thái</p>
                <p className="text-xs font-black uppercase italic bg-green-500 px-3 py-1 rounded-full text-white">Chờ duyệt</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100">
                  <img src={booking.car?.image} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-blue-900 uppercase italic text-lg">{booking.car?.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase">
                    <MapPin size={12} className="text-blue-600"/> {booking.car?.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-dashed border-gray-100 mb-6">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase italic mb-1">Ngày nhận</p>
                  <p className="font-black text-blue-900 text-sm uppercase italic">{new Date(booking.startDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase italic mb-1">Ngày trả</p>
                  <p className="font-black text-blue-900 text-sm uppercase italic">{new Date(booking.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase italic">Tổng tiền đã đặt:</span>
                <span className="text-3xl font-black text-blue-600 italic tracking-tighter">
                  {booking.totalPrice?.toLocaleString()}đ
                </span>
              </div>
              {booking.promoCode && (
                <p className="mt-2 text-[9px] font-black text-green-600 uppercase italic flex items-center gap-1">
                   <Tag size={10}/> Đã áp dụng mã: {booking.promoCode}
                </p>
              )}
            </div>
          </div>
        )}

        {/* HỆ THỐNG NÚT BẤM ĐIỀU HƯỚNG */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/profile" 
            className="flex-1 bg-blue-600 text-white font-black py-5 rounded-[24px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase italic tracking-tighter flex items-center justify-center gap-3"
          >
            <ListOrdered size={20} /> Xem lịch sử đặt chuyến
          </Link>
          
          <Link 
            href="/" 
            className="flex-1 bg-white text-blue-900 font-black py-5 rounded-[24px] border border-gray-200 hover:bg-gray-50 transition-all uppercase italic tracking-tighter flex items-center justify-center gap-3"
          >
            <Home size={20} /> Quay về trang chủ
          </Link>
        </div>

      </div>
    </main>
  );
}