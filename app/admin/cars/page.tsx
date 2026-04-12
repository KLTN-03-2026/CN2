/* eslint-disable */
// @ts-nocheck
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, CarFront, CheckCircle2, Clock, CalendarDays, CalendarClock } from "lucide-react";
import ActionButtons from "./ActionButtons"; 

export const dynamic = "force-dynamic";

// Hàm format thời gian chuẩn VN
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

export default async function AdminCarsManagerPage() {
  // Lấy toàn bộ xe, kèm theo các chuyến xe của nó để kiểm tra lịch
  const cars = await prisma.car.findMany({
    include: {
      bookings: {
        where: {
          status: { not: "CANCELLED" } // Không tính các chuyến đã hủy
        },
        orderBy: { startDate: 'asc' } // Sắp xếp từ cũ đến mới để dễ tìm chuyến tiếp theo
      }
    },
    orderBy: { id: "desc" } // Xe mới thêm hiện lên đầu
  });

  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* 🚀 ĐÃ SỬA: Trả lại max-w-7xl để khung canh giữa gọn gàng không bị tràn viền */}
      <div className="max-w-7xl mx-auto"> 
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-3">
              <CarFront className="text-blue-600 w-8 h-8" /> Quản lý Đội xe
            </h1>
            <p className="text-gray-500 font-medium mt-1">Tổng cộng {cars.length} chiếc xe trong hệ thống</p>
          </div>
          <Link href="/admin/cars/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-200 flex items-center gap-2 shrink-0">
            <Plus size={18} /> Thêm xe mới
          </Link>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {/* 🚀 ĐÃ SỬA: Bỏ thuộc tính ép chiều rộng tối thiểu */}
            <table suppressHydrationWarning className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="p-5">ID</th>
                  <th className="p-5">Thông tin xe</th>
                  <th className="p-5">Phân loại</th>
                  <th className="p-5">Giá/Ngày</th>
                  <th className="p-5">Trạng thái</th>
                  <th className="p-5">Lịch trình gần nhất</th>
                  <th className="p-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cars.map((car: any) => {
                  // 1. TÌM CHUYẾN ĐANG CHẠY
                  const currentBooking = car.bookings.find(
                    (b: any) => new Date(b.startDate) <= now && new Date(b.endDate) >= now
                  );
                  
                  // 2. TÌM CHUYẾN SẮP TỚI
                  const nextBooking = !currentBooking ? car.bookings.find(
                    (b: any) => new Date(b.startDate) > now
                  ) : null;

                  const isBusy = !!currentBooking;

                  return (
                    <tr key={car.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-5 font-bold text-gray-400 text-sm">#{car.id}</td>
                      
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-100 relative bg-gray-100 shrink-0">
                            <img src={car.image} alt={car.name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <p className="font-black text-blue-900 uppercase tracking-tighter text-base">{car.name}</p>
                            <p className="text-xs font-medium text-gray-500 truncate max-w-[150px]" title={car.address || car.location}>
                              {car.address ? car.address.split(',')[0] : car.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 🚀 ĐÃ SỬA: Xóa bỏ whitespace-nowrap để các cột tự do co giãn */}
                      <td className="p-5">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest block w-fit">
                          {car.brand} - {car.transmission === "Automatic" ? "TĐ" : "Sàn"}
                        </span>
                      </td>

                      <td className="p-5 font-black text-green-600 italic">
                        {new Intl.NumberFormat('vi-VN').format(car.priceDiscount)}đ
                      </td>

                      <td className="p-5">
                        {isBusy ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100">
                            <Clock size={14} /> Đang cho thuê
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100">
                            <CheckCircle2 size={14} /> Sẵn sàng
                          </div>
                        )}
                      </td>

                      <td className="p-5">
                        {currentBooking ? (
                          <div className="text-xs font-medium text-orange-700 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/50">
                            <p className="flex items-center gap-1.5 mb-1"><Clock size={12} className="text-orange-500" /> <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Đang chạy</span></p>
                            <p>Nhận: <span className="font-bold">{formatDate(currentBooking.startDate)}</span></p>
                            <p>Trả: <span className="font-bold text-red-600">{formatDate(currentBooking.endDate)}</span></p>
                          </div>
                        ) : nextBooking ? (
                          <div className="text-xs font-medium text-blue-700 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                            <p className="flex items-center gap-1.5 mb-1"><CalendarClock size={12} className="text-blue-500" /> <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Sắp giao</span></p>
                            <p>Nhận: <span className="font-bold">{formatDate(nextBooking.startDate)}</span></p>
                            <p>Trả: <span className="font-bold text-red-600">{formatDate(nextBooking.endDate)}</span></p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                            <CalendarDays size={14} /> <span className="text-[10px] uppercase tracking-widest">Trống lịch</span>
                          </div>
                        )}
                      </td>

                      <td className="p-5">
                        <ActionButtons carId={car.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {cars.length === 0 && (
              <div className="p-10 text-center text-gray-400 font-bold italic">
                Chưa có chiếc xe nào trong hệ thống. Hãy thêm xe mới nhé!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}