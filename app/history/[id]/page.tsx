/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, ShieldCheck, MapPin, Calendar, 
  Phone, User as UserIcon, AlertTriangle, CreditCard, Loader2,
  FileText, Receipt, Car, CheckCircle2, Star // 🚀 IMPORT THÊM ICON STAR
} from "lucide-react";

// 🚀 IMPORT COMPONENT POPUP ĐÁNH GIÁ (Đúng chuẩn thư mục features)
import ReviewModal from "@/components/features/ReviewModal";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 🚀 THÊM STATE ĐỂ QUẢN LÝ ĐÓNG/MỞ POPUP ĐÁNH GIÁ
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Đưa hàm fetch ra ngoài để có thể gọi lại sau khi Đánh giá xong
  const fetchBookingDetail = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();

      if (res.ok) {
        setBooking(data.booking);
      } else {
        setError(data.error || "Không thể tải chi tiết đơn hàng.");
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId) return;
    fetchBookingDetail();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-blue-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-[10px] italic">Đang tải dữ liệu chuyến đi...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center pt-20">
        <AlertTriangle size={64} className="text-red-400 mb-4" />
        <h2 className="text-xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Lỗi truy xuất</h2>
        <p className="text-gray-500 font-medium mb-6 text-sm">{error || "Đơn hàng không tồn tại hoặc bạn không có quyền xem."}</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase rounded-xl shadow-lg hover:bg-blue-700">
          Quay lại lịch sử
        </button>
      </div>
    );
  }

  // LOGIC TÍNH TOÁN & HIỂN THỊ HÓA ĐƠN CHI TIẾT
  const deliveryFee = booking.deliveryFee || 0; 
  const serviceFee = booking.serviceFee || 120000; 
  const carRentalFee = booking.totalPrice - deliveryFee - serviceFee; 
  
  const depositPaid = booking.paymentStatus === "PAID_FULL" 
    ? booking.totalPrice 
    : (booking.depositAmount || (booking.totalPrice * 0.3));
    
  const balanceDue = booking.paymentStatus === "PAID_FULL" 
    ? 0 
    : (booking.totalPrice - depositPaid);

// 🚀 KIỂM TRA PHÂN LOẠI XE
const isCompanyCar = booking.car?.ownerType === "COMPANY" || !booking.car?.userId;

// Nếu là xe nhà -> Hiện tên Công ty & Hotline. Nếu xe đối tác -> Hiện tên & SĐT đối tác.
const ownerName = isCompanyCar 
  ? "Hệ Thống ViVuCar" 
  : (booking.car?.user?.name || booking.car?.ownerName || "Đối tác ViVuCar");
  
const ownerPhone = isCompanyCar 
  ? "0789430618" // 👈 Chỗ này bạn có thể thay bằng số Hotline thật của đồ án
  : (booking.car?.user?.phone || booking.car?.ownerPhone || "Chưa cập nhật");
  const isHomeDelivery = deliveryFee > 0;

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-28 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* NÚT QUAY LẠI */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-blue-600 font-black uppercase italic text-[10px] mb-6 hover:bg-blue-50 px-4 py-2 rounded-xl w-fit transition-all"
        >
          <ChevronLeft size={16} /> Quay lại lịch sử
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">
            Chi tiết chuyến đi <span className="text-blue-600">#{booking.id}</span>
          </h1>
          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic border shadow-sm ${
            booking.status === "PENDING" ? "bg-orange-50 text-orange-500 border-orange-200 animate-pulse" :
            booking.status === "CONFIRMED" ? "bg-blue-50 text-blue-600 border-blue-200" :
            booking.status === "IN_PROGRESS" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
            booking.status === "RETURNED" ? "bg-teal-50 text-teal-600 border-teal-200" :
            booking.status === "COMPLETED" ? "bg-green-50 text-green-600 border-green-200" :
            "bg-red-50 text-red-500 border-red-200"
          }`}>
            {booking.status === "PENDING" ? "Chờ thanh toán cọc" : 
             booking.status === "CONFIRMED" ? "Đã xác nhận" : 
             booking.status === "IN_PROGRESS" ? "Đang diễn ra" : 
             booking.status === "RETURNED" ? "Chờ chốt doanh thu" : 
             booking.status === "COMPLETED" ? "Hoàn thành" : "Đã hủy"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI (2/3): THÔNG TIN XE VÀ HÓA ĐƠN */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-blue-900 uppercase italic mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" /> Hành trình & Giao nhận
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <img src={booking.car?.image || "https://placehold.co/600x400?text=ViVuCar"} className="w-full sm:w-40 h-28 object-cover rounded-2xl bg-gray-100" alt="Car" />
                <div>
                  <h3 className="font-black text-xl text-blue-900 uppercase italic tracking-tighter leading-none mb-2">{booking.car?.name}</h3>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                      <Car size={12} className="text-blue-500" /> 
                      Hình thức: {isHomeDelivery ? <span className="text-blue-600">Giao xe tận nơi</span> : <span>Tự đến lấy xe</span>}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-start gap-1.5 leading-tight">
                      <MapPin size={12} className="text-red-500 shrink-0 mt-0.5" /> 
                      <span>{booking.location || booking.car?.address || booking.car?.location || "Chưa cập nhật địa chỉ"}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nhận xe</p>
                  <p className="text-sm font-black uppercase italic text-blue-900 leading-none">
                    {new Date(booking.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">{new Date(booking.startDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-gray-200 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-gray-300">
                    <Calendar size={14} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trả xe</p>
                  <p className="text-sm font-black uppercase italic text-blue-900 leading-none">
                    {new Date(booking.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">{new Date(booking.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-blue-900 uppercase italic mb-4 flex items-center gap-2">
                <Receipt size={18} className="text-blue-600" /> Bảng kê chi phí
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2 pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                    <span>Đơn giá thuê xe gốc</span>
                    <span>{carRentalFee.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                    <span>Phí bảo hiểm chuyến đi</span>
                    <span>{serviceFee > 0 ? `${serviceFee.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</span>
                  </div>
                  {isHomeDelivery && (
                    <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                      <span>Phí giao xe tận nơi</span>
                      <span>{deliveryFee.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm font-black text-blue-900 uppercase">
                  <span>Tổng cộng</span>
                  <span className="text-lg">{booking.totalPrice?.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="pt-2 space-y-2 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-500 font-bold">
                    <span>Đã thanh toán qua web (Cọc)</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={14} /> -{depositPaid.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100 mt-2">
                    <div>
                      <span className="block text-[12px] font-black text-blue-900 uppercase tracking-widest">Tiền mặt trả chủ xe</span>
                      <span className="text-[9px] text-blue-600/70 font-medium italic">* Vui lòng thanh toán khi nhận xe</span>
                    </div>
                    <span className="text-3xl font-black text-blue-600 italic tracking-tighter">
                      {balanceDue.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (1/3): CHỦ XE, HỢP ĐỒNG & BẢO MẬT */}
          <div className="space-y-6">
            
            {/* THÔNG TIN CHỦ XE */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              <h2 className="font-black text-blue-900 uppercase italic tracking-tighter text-lg mb-4">Thông tin liên hệ</h2>
              
              {booking.status === "PENDING" ? (
                 <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
                   <ShieldCheck className="text-orange-400 mx-auto mb-2" size={24} />
                   <p className="text-[10px] font-black uppercase text-orange-600 mb-1">Bảo mật thông tin</p>
                   <p className="text-[10px] text-orange-800 leading-relaxed font-medium">
                     Đang chờ thanh toán. Thông tin liên hệ sẽ được hiển thị ngay khi bạn hoàn tất đặt cọc.
                   </p>
                 </div>
              ) : booking.status === "CANCELLED" ? (
                 <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                   <AlertTriangle className="text-gray-400 mx-auto mb-2" size={24} />
                   <p className="text-[10px] text-gray-500 font-medium">Chuyến đi đã bị hủy, thông tin liên lạc đã được ẩn.</p>
                 </div>
              ) : (
                 <div className="flex flex-col items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 overflow-hidden shadow-inner">
                     <img src={`https://ui-avatars.com/api/?name=${ownerName}&background=0D47A1&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                   </div>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Chủ xe</p>
                   <p className="font-black text-blue-900 text-lg uppercase italic tracking-tighter mb-4 text-center">{ownerName}</p>
                   
                   <div className="w-full bg-white border border-blue-100 p-3 rounded-xl flex items-center justify-between mb-4 shadow-sm">
                     <span className="text-[10px] font-black text-blue-400 uppercase">SĐT</span>
                     <span className="font-black text-blue-600 tracking-wider">{ownerPhone}</span>
                   </div>

                   <a href={`tel:${ownerPhone}`} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-black uppercase italic text-[11px] rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                     <Phone size={14} /> Gọi ngay
                   </a>
                 </div>
              )}
            </div>

            {/* XEM HỢP ĐỒNG ĐIỆN TỬ */}
            {booking.status !== "PENDING" && booking.status !== "CANCELLED" && (
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
                <FileText className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 transform group-hover:scale-110 transition-all duration-500" />
                <h3 className="font-black uppercase italic tracking-tighter text-lg mb-2 relative z-10">Hợp đồng thuê xe</h3>
                <p className="text-[10px] text-blue-200 font-medium leading-relaxed mb-4 relative z-10 pr-4">
                  Các điều khoản, quyền lợi và trách nhiệm của hai bên đã được ghi nhận trên hệ thống.
                </p>
                <Link 
                  href={`/contracts/${booking.id}`}
                  className="w-full bg-white/20 hover:bg-white text-white hover:text-blue-900 backdrop-blur-sm flex justify-center items-center gap-2 py-3 font-black uppercase italic text-[10px] rounded-xl transition-all relative z-10 border border-white/30 hover:border-white"
                >
                  <FileText size={14} /> Xem lại hợp đồng
                </Link>
              </div>
            )}
            
            {/* 🚀 NÚT ĐÁNH GIÁ CHUYẾN ĐI (CHỈ HIỆN KHI ĐÃ HOÀN THÀNH) */}
            {booking.status === "COMPLETED" && (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-[32px] text-white shadow-xl shadow-orange-200 relative overflow-hidden group">
                <Star className="absolute -right-4 -bottom-4 w-24 h-24 text-white/20 transform group-hover:scale-110 transition-all duration-500 fill-white/20" />
                <h3 className="font-black uppercase italic tracking-tighter text-lg mb-2 relative z-10">Đánh giá dịch vụ</h3>
                <p className="text-[10px] text-orange-100 font-medium leading-relaxed mb-4 relative z-10 pr-4">
                  Trải nghiệm của bạn như thế nào? Hãy chia sẻ để cộng đồng ViVuCar ngày càng tốt hơn nhé!
                </p>
                <button 
                  onClick={() => setIsReviewOpen(true)}
                  className="w-full bg-white text-orange-500 hover:bg-orange-50 flex justify-center items-center gap-2 py-3 font-black uppercase italic text-[10px] rounded-xl transition-all relative z-10 shadow-md"
                >
                  <Star size={14} className="fill-orange-500" /> Viết Đánh Giá Ngay
                </button>
              </div>
            )}

            {/* NÚT THANH TOÁN / HỦY ĐƠN */}
            {booking.status === "PENDING" && (
              <Link href={`/payment/${booking.id}`} className="w-full flex justify-center py-4 bg-blue-600 text-white font-black uppercase italic text-[10px] rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-3">
                Thanh toán cọc ngay
              </Link>
            )}

            {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
              <button 
                onClick={() => alert('Vui lòng quay lại màn hình Lịch sử chuyến đi để thực hiện Hủy đơn!')} 
                className="w-full py-4 mt-2 bg-white border-2 border-dashed border-red-200 text-red-500 font-black uppercase italic text-[10px] rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all"
              >
                Yêu cầu hủy chuyến đi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 GỌI COMPONENT POPUP ĐÁNH GIÁ VÀO ĐÂY */}
      {booking && (
        <ReviewModal 
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          bookingId={booking.id}
          carId={booking.carId}
          carName={booking.car?.name || "Chuyến đi"}
          onSuccess={() => {
            fetchBookingDetail(); // Reload lại dữ liệu trang mà không cần F5
          }}
        />
      )}

    </main>
  );
}