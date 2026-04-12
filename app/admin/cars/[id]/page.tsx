/* eslint-disable */
// @ts-nocheck
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, CarFront, User, Phone, MapPin, CalendarDays, CreditCard, AlertCircle, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

export default async function AdminCarProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // Bắt buộc phải có chữ await để đợi hệ thống đọc xong thanh URL
    const resolvedParams = await params;
    const carId = parseInt(resolvedParams.id);
  
    // Thêm chốt chặn an toàn: Lỡ ai gõ bậy bạ chữ cái lên URL thì báo lỗi 404 luôn
    if (isNaN(carId)) return <div className="p-20 text-center font-black text-2xl uppercase text-red-500">404 - ID Xe không hợp lệ!</div>;
  
    // Moi toàn bộ dữ liệu xe... (Các code bên dưới giữ nguyên)
    const car = await prisma.car.findUnique({
      where: { id: carId },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' }, // Chuyến mới nhất lên đầu
        include: {
          user: true // Kéo luôn thông tin khách hàng từ bảng User
        }
      }
    }
  });

  if (!car) return <div className="p-20 text-center font-black text-2xl uppercase">404 - Không tìm thấy xe</div>;

  const now = new Date();
  
  // Tìm chuyến xe ĐANG DIỄN RA (Giờ hiện tại nằm giữa lúc nhận và trả xe)
  const currentBooking = car.bookings.find(
    (b: any) => new Date(b.startDate) <= now && new Date(b.endDate) >= now && b.status !== "CANCELLED"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <Link href="/admin/cars" className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-6 hover:text-blue-600">
          <ChevronLeft size={16} /> Quay lại Danh sách xe
        </Link>

        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-4 border-white">
              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter mb-2">
                {car.name} <span className="text-gray-400 text-lg">#{car.id}</span>
              </h1>
              <div className="flex gap-2">
                <span className="bg-gray-200 text-gray-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{car.brand}</span>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Giá gốc: {formatCurrency(car.priceDiscount)}/ngày</span>
              </div>
            </div>
          </div>

          {/* TRẠNG THÁI HIỆN TẠI */}
          {currentBooking ? (
            <div className="bg-orange-100 border border-orange-200 text-orange-800 px-6 py-4 rounded-2xl text-right animate-pulse">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Trạng thái hiện tại</p>
              <p className="font-black text-xl italic flex items-center gap-2 justify-end">
                <AlertCircle size={20} /> ĐANG CHO THUÊ
              </p>
            </div>
          ) : (
            <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-2xl text-right">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Trạng thái hiện tại</p>
              <p className="font-black text-xl italic flex items-center gap-2 justify-end">
                <CarFront size={20} /> ĐANG ĐẬU TẠI BÃI (SẴN SÀNG)
              </p>
            </div>
          )}
        </div>

        {/* NẾU XE ĐANG CHO THUÊ -> HIỆN THÔNG TIN KHÁCH ĐANG CẦM LÁI LÊN ĐẦU */}
        {currentBooking && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-3xl shadow-sm border border-orange-100 mb-8">
            <h2 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle size={18} /> Thông tin chuyến đi hiện tại
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Người đang thuê</p>
                <p className="font-bold text-gray-900 flex items-center gap-2 mb-1"><User size={16} className="text-orange-500"/> {currentBooking.user.name || currentBooking.user.email}</p>
                <p className="font-medium text-gray-600 flex items-center gap-2"><Phone size={16} className="text-orange-500"/> {currentBooking.user.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Lịch trình</p>
                <p className="font-bold text-gray-900 flex items-center gap-2 mb-1"><CalendarDays size={16} className="text-orange-500"/> Nhận: {formatDate(currentBooking.startDate)}</p>
                <p className="font-bold text-gray-900 flex items-center gap-2"><CalendarDays size={16} className="text-orange-500"/> Trả: {formatDate(currentBooking.endDate)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Thu nhập chuyến này</p>
                <p className="text-2xl font-black text-green-600 italic mb-2">{formatCurrency(currentBooking.totalPrice)}</p>
                <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <MapPin size={14} /> Giao xe: {currentBooking.isDelivery ? "Tận nhà" : "Tại bãi"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LỊCH SỬ TẤT CẢ CÁC CHUYẾN THUÊ CỦA XE NÀY */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <CalendarDays className="text-blue-600" />
            <h2 className="text-lg font-black text-blue-900 uppercase tracking-tighter">Lịch sử được thuê ({car.bookings.length} chuyến)</h2>
          </div>
          
          <div className="overflow-x-auto">
          <table suppressHydrationWarning className="w-full text-left border-collapse">
  <thead>
    <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
      <th className="p-5">Mã HĐ</th>
      <th className="p-5">Khách hàng</th>
      <th className="p-5">Lịch trình</th>
      <th className="p-5">Giao xe</th>
      <th className="p-5">Doanh thu</th>
      <th className="p-5">Trạng thái</th>
      <th className="p-5 text-right">Hợp đồng</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-50">
    {car.bookings.map((booking: any) => (
      <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors">
        <td className="p-5 font-bold text-gray-400 text-sm">#{booking.id}</td>
        
        <td className="p-5">
          <p className="font-bold text-gray-900">{booking.user.name || "Chưa cập nhật tên"}</p>
          <p className="text-xs font-medium text-gray-500">{booking.user.phone}</p>
        </td>

        <td className="p-5 text-sm font-medium text-gray-600">
          <p className="mb-1 text-green-700">Nhận: {formatDate(booking.startDate)}</p>
          <p className="text-red-700">Trả: {formatDate(booking.endDate)}</p>
        </td>

        <td className="p-5">
          {booking.isDelivery ? (
             <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
               Tận nhà
             </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
               Tự lấy
            </span>
          )}
        </td>

        <td className="p-5 font-black text-green-600 italic text-base">
          {formatCurrency(booking.totalPrice)}
        </td>

        <td className="p-5">
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest
            ${booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
            ${booking.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" : ""}
            ${booking.status === "COMPLETED" ? "bg-green-100 text-green-700" : ""}
            ${booking.status === "CANCELLED" ? "bg-red-100 text-red-700 line-through" : ""}
            ${booking.status === "Đã hủy" ? "bg-red-100 text-red-700 line-through" : ""}
          `}>
            {booking.status}
          </span>
        </td>

        <td className="p-5 text-right">
          <Link 
            href={`/contracts/${booking.id}`} 
            target="_blank" 
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-blue-100 hover:border-blue-600"
          >
            <FileText size={14} /> Xuất PDF
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>

            {car.bookings.length === 0 && (
              <div className="p-10 text-center text-gray-400 font-bold italic">
                Chiếc xe này chưa có ai thuê bao giờ. Vẫn còn chờ đón khách đầu tiên!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}