/* eslint-disable */
// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 
import { 
  CarFront, Clock, CheckCircle2, XCircle, 
  CalendarDays, Wallet, Plus, ArrowRight, ShieldCheck, Banknote, Loader2,
  Edit, Trash2, ClipboardList, User as UserIcon, Phone, MapPin, Check,
  Hourglass, ChevronDown, ChevronUp // 🚀 IMPORT THÊM ICON
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PartnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const userName = session?.user?.name || "Đối tác";

  const [myCars, setMyCars] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0); 
  const [bookings, setBookings] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚀 BIẾN QUẢN LÝ SỐ LƯỢNG ĐƠN HÀNG HIỂN THỊ (Mặc định hiện 4 đơn)
  const [visibleBookingsCount, setVisibleBookingsCount] = useState(4);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/?auth=login&callback=/partner/dashboard");
      return;
    }

    const fetchDashboardData = async () => {
        try {
          const [carsRes, walletRes, bookingsRes] = await Promise.all([
            fetch('/api/partner/cars'),
            fetch('/api/partner/wallet'),
            fetch('/api/partner/bookings') 
          ]);
  
          if (carsRes.ok) {
             const carsData = await carsRes.json();
             if (carsData.success) setMyCars(carsData.cars);
          }
  
          if (walletRes.ok) {
             const walletData = await walletRes.json();
             if (walletData.success) setWalletBalance(walletData.wallet.balance);
          }

          if (bookingsRes.ok) {
             const bookingsData = await bookingsRes.json();
             if (bookingsData.success) setBookings(bookingsData.bookings);
          }
  
        } catch (error) {
          console.error("LỖI TẢI DỮ LIỆU DASHBOARD:", error);
        } finally {
          setIsLoading(false);
        }
      };

    fetchDashboardData();
  }, [status, router]);

  const handleDeleteCar = async (carId: number, carName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa xe ${carName} không?\nHành động này không thể hoàn tác!`)) return;

    try {
      const res = await fetch(`/api/cars/${carId}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        alert("Đã xóa xe thành công!");
        setMyCars(prev => prev.filter(c => c.id !== carId)); 
      } else {
        alert(`Lỗi: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối máy chủ!");
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    const actionName = 
        newStatus === 'IN_PROGRESS' ? 'Xác nhận đã GIAO XE cho khách' : 
        newStatus === 'RETURNED' ? 'Xác nhận đã NHẬN LẠI XE an toàn' : '';
    
    if(!window.confirm(`Xác nhận hành động: ${actionName}?`)) return;

    try {
        const res = await fetch(`/api/partner/bookings/${bookingId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newStatus })
        });

        if (res.ok) {
            alert(`Thành công! Trạng thái đơn hàng #${bookingId} đã được cập nhật.`);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } else {
            const data = await res.json();
            alert(`Lỗi: ${data.error}`);
        }
    } catch (error) {
        alert("Lỗi kết nối máy chủ");
    }
  };

  const approvedCount = myCars.filter(c => c.status === "APPROVED").length;
  const pendingCount = myCars.filter(c => c.status === "PENDING").length;

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-[10px] italic">Hệ thống đang đồng bộ dữ liệu đối tác...</p>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  // 🚀 LẤY RA DANH SÁCH ĐƠN HÀNG SẼ HIỂN THỊ (Cắt từ 0 đến visibleBookingsCount)
  const visibleBookings = bookings.slice(0, visibleBookingsCount);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-24 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* HEADER */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">
              Trung tâm đối tác
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter">
            Xin chào, {userName}!
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-2">
            Quản lý đội xe và theo dõi doanh thu của bạn tại ViVuCar.
          </p>
        </div>

        {/* THỐNG KÊ (WIDGETS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Xe đang hoạt động</p>
                    <h3 className="text-3xl font-black text-blue-900">{approvedCount}</h3>
                </div>
                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={28} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Đang chờ duyệt</p>
                    <h3 className="text-3xl font-black text-yellow-600">{pendingCount}</h3>
                </div>
                <div className="w-14 h-14 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center">
                    <Clock size={28} />
                </div>
            </div>

            <Link 
                href="/partner/wallet" 
                className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-[24px] shadow-lg shadow-blue-200 flex flex-col justify-center items-start text-white relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all block"
            >
                <Wallet className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 transform group-hover:scale-110 transition-all duration-500" />
                <p className="text-[11px] font-black text-blue-200 uppercase tracking-widest mb-1 relative z-10">Số dư ví</p>
                <h3 className="text-2xl font-black relative z-10">{(walletBalance || 0).toLocaleString('vi-VN')}đ</h3>
                <div className="mt-2 text-[10px] font-bold text-blue-100 flex items-center gap-1 relative z-10">
                    Chạm để rút tiền <ArrowRight size={12} />
                </div>
            </Link>
        </div>

        {/* KHU VỰC QUẢN LÝ ĐƠN HÀNG */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-gray-50 pb-6">
                <div>
                    <h2 className="text-xl font-black text-blue-900 uppercase italic flex items-center gap-2">
                        <ClipboardList size={24} className="text-blue-600"/> Đơn hàng gần đây
                    </h2>
                    <p className="text-xs font-bold text-gray-400 mt-1">Quản lý việc giao xe và nhận lại xe từ khách hàng</p>
                </div>
            </div>

            <div className="space-y-6">
                {bookings.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
                        <ClipboardList className="mx-auto text-gray-300 mb-3" size={40} />
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Hiện chưa có đơn hàng nào chờ xử lý.</p>
                    </div>
                ) : (
                  // 🚀 CHỈ RENDER BIẾN visibleBookings
                  visibleBookings.map((booking) => (
                    <div key={booking.id} className="bg-gray-50/50 border border-blue-100 rounded-[24px] p-5 hover:shadow-md transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            
                            {/* THÔNG TIN CHUYẾN ĐI & KHÁCH HÀNG */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase">#{booking.id}</span>
                                    <h3 className="font-black text-blue-900 text-lg uppercase italic tracking-tighter">{booking.car?.name || "Xe không xác định"}</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p className="flex items-center gap-2"><UserIcon size={14} className="text-gray-400"/> <span className="font-bold">{booking.user?.name || "Khách hàng"}</span></p>
                                        <p className="flex items-center gap-2"><MapPin size={14} className="text-red-400"/> {booking.location || "Địa điểm mặc định"}</p>
                                        
                                        {booking.status !== 'PENDING' ? (
                                            <p className="flex items-center gap-2 text-blue-600 font-bold"><Phone size={14}/> {booking.user?.phone || "Chưa cập nhật SĐT"}</p>
                                        ) : (
                                            <p className="flex items-center gap-2 text-gray-400 italic text-xs"><ShieldCheck size={14}/> SĐT bị ẩn chờ thanh toán</p>
                                        )}
                                    </div>
                                    <div className="space-y-2 text-xs font-bold text-gray-500 bg-white p-3 rounded-xl border border-gray-100">
                                        <p className="flex items-center gap-2 text-green-600"><CheckCircle2 size={14}/> Nhận: {new Date(booking.startDate).toLocaleString('vi-VN')}</p>
                                        <p className="flex items-center gap-2 text-orange-600"><Clock size={14}/> Trả: {new Date(booking.endDate).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* KHU VỰC NÚT BẤM VÀ TRẠNG THÁI */}
                            <div className="flex flex-col gap-2 min-w-[190px] border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-4 justify-center">
                                
                                {booking.status === 'PENDING' && (
                                    <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <Hourglass size={20} className="mx-auto text-orange-400 mb-1 animate-pulse" />
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Đang chờ khách nạp cọc</p>
                                        <p className="text-[9px] text-orange-400 italic mt-1">Đơn tự động hủy sau 20 phút</p>
                                    </div>
                                )}
                                
                                {booking.status === 'CONFIRMED' && (
                                    <>
                                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest text-center mb-1">Khách đã cọc thành công</p>
                                        <button onClick={() => handleUpdateBookingStatus(booking.id, 'IN_PROGRESS')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-200">
                                            <CarFront size={16} /> Đã giao xe cho khách
                                        </button>
                                    </>
                                )}

                                {booking.status === 'IN_PROGRESS' && (
                                    <>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest text-center mb-1">Khách đang sử dụng xe</p>
                                        <button onClick={() => handleUpdateBookingStatus(booking.id, 'RETURNED')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-200">
                                            <CheckCircle2 size={16} /> Đã nhận lại xe
                                        </button>
                                    </>
                                )}

                                {booking.status === 'RETURNED' && (
                                    <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                                        <ShieldCheck size={20} className="mx-auto text-green-500 mb-1" />
                                        <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Đã thu hồi xe</p>
                                        <p className="text-[9px] text-green-600 italic mt-1">Đang chờ Admin chốt doanh thu</p>
                                    </div>
                                )}

                                {booking.status === 'COMPLETED' && (
                                    <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <CheckCircle2 size={20} className="mx-auto text-blue-500 mb-1" />
                                        <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Đã hoàn thành</p>
                                    </div>
                                )}

                                {booking.status === 'CANCELLED' && (
                                    <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100">
                                        <XCircle size={20} className="mx-auto text-red-500 mb-1" />
                                        <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">Đã hủy</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                  ))
                )}
            </div>
            
            {/* 🚀 NÚT HIỂN THỊ THÊM / THU GỌN */}
            {bookings.length > 4 && (
                <div className="mt-8 flex justify-center border-t border-gray-100 pt-6">
                    {visibleBookingsCount < bookings.length ? (
                        <button 
                            onClick={() => setVisibleBookingsCount(bookings.length)}
                            className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-6 py-3 rounded-xl transition-all italic border border-blue-100"
                        >
                            Xem tất cả ({bookings.length}) đơn hàng <ChevronDown size={16} />
                        </button>
                    ) : (
                        <button 
                            onClick={() => setVisibleBookingsCount(4)}
                            className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 px-6 py-3 rounded-xl transition-all italic border border-gray-200"
                        >
                            Thu gọn danh sách <ChevronUp size={16} />
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* DANH SÁCH XE */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-gray-50 pb-6">
                <div>
                    <h2 className="text-xl font-black text-gray-800 uppercase italic">Đội xe của tôi</h2>
                    <p className="text-xs font-bold text-gray-400 mt-1">Cập nhật trạng thái xe</p>
                </div>
                <Link href="/partner" className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-black uppercase tracking-widest py-3 px-5 rounded-xl transition-all text-xs">
                    <Plus size={16} /> Đăng ký thêm xe
                </Link>
            </div>

            <div className="space-y-6">
                {myCars.length === 0 ? (
                    <div className="text-center py-10">
                        <CarFront className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Bạn chưa đăng ký phương tiện nào.</p>
                    </div>
                ) : (
                    myCars.map((car) => (
                        <div key={car.id} className="flex flex-col lg:flex-row bg-gray-50/50 border border-gray-100 rounded-[24px] p-5 gap-6 items-start lg:items-center transition-all hover:bg-white hover:border-blue-100 hover:shadow-md">
                            <div className="flex items-center gap-5 flex-1 w-full">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                    car.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                                    car.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-500'
                                }`}>
                                    <CarFront size={28} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-blue-900 text-lg uppercase italic tracking-tighter">{car.name}</h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white border border-gray-200 px-2 py-1 rounded-md">
                                            Biển số: {car.licensePlate || 'Chưa cập nhật'}
                                        </span>
                                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                            <Banknote size={14}/> {car.priceOriginal?.toLocaleString('vi-VN')}đ / ngày
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    {car.status === 'APPROVED' && (
                                        <>
                                            <div className="flex justify-center items-center gap-2 text-green-600 font-black text-[10px] uppercase bg-green-50 px-3 py-2 rounded-lg w-full sm:w-auto italic">
                                                <CheckCircle2 size={14} /> Đang hoạt động
                                            </div>
                                            <Link href="/partner/calendar" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest px-6 py-2 rounded-xl transition-all italic">
                                                <CalendarDays size={14} /> Quản lý lịch
                                            </Link>
                                        </>
                                    )}
                                    {car.status === 'PENDING' && (
                                        <>
                                            <div className="flex justify-center items-center gap-2 text-yellow-600 font-black text-[10px] uppercase bg-yellow-50 px-3 py-2 rounded-lg w-full sm:w-auto italic">
                                                <Clock size={14} /> Chờ kiểm duyệt
                                            </div>
                                            <div className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest px-6 py-2 rounded-xl cursor-not-allowed italic">
                                                <CalendarDays size={14} /> Quản lý lịch
                                            </div>
                                        </>
                                    )}
                                    {car.status === 'REJECTED' && (
                                        <div className="w-full">
                                            <div className="flex justify-center items-center gap-2 text-red-500 font-black text-[10px] uppercase bg-red-50 px-3 py-2 rounded-lg w-full sm:w-auto mb-2 italic">
                                                <XCircle size={14} /> Bị từ chối
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 text-center sm:text-left">Lý do: <span className="text-red-500 italic">{car.rules || "Liên hệ hỗ trợ"}</span></p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex sm:flex-col gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-3">
                                    <Link href={`/partner/cars/${car.id}/edit`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest">
                                        <Edit size={14} /> Sửa
                                    </Link>
                                    <button onClick={() => handleDeleteCar(car.id, car.name)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest">
                                        <Trash2 size={14} /> Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </main>
  );
}