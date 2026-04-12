/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Car, Plus, Trash2, ShieldAlert, Clock, ArrowRight, Loader2 } from "lucide-react";

export default function PartnerCalendarPage() {
  const [myCars, setMyCars] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    carId: "",
    startDate: "",
    endDate: "",
    reason: "Chủ xe sử dụng"
  });

  // 1. TẢI DỮ LIỆU THẬT KHI MỞ TRANG
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tải danh sách xe của đối tác (Sử dụng lại API đã có)
        const carsRes = await fetch('/api/partner/cars');
        const carsData = await carsRes.json();
        
        // Tải danh sách lịch bận
        const blocksRes = await fetch('/api/partner/blocked-dates');
        const blocksData = await blocksRes.json();

        if (carsData.success) {
          const approvedCars = carsData.cars.filter(car => car.status === "APPROVED");
          setMyCars(approvedCars);
          if (approvedCars.length > 0) {
            setFormData(prev => ({ ...prev, carId: approvedCars[0].id }));
          }
        }
        if (blocksData.success) setBlockedDates(blocksData.blockedDates);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. HÀM KHÓA LỊCH (GỌI API POST)
  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
        return alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu!");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/partner/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setBlockedDates([...blockedDates, data.block]);
        setFormData({ ...formData, startDate: "", endDate: "", reason: "Chủ xe sử dụng" });
      } else {
        alert(data.error || "Lỗi khóa lịch");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. HÀM MỞ KHÓA LỊCH (GỌI API DELETE)
  const handleUnblock = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn mở khóa lịch này? Khách hàng sẽ có thể đặt xe của bạn.")) return;

    try {
      const res = await fetch(`/api/partner/blocked-dates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setBlockedDates(blockedDates.filter(block => block.id !== id));
      } else {
        alert("Lỗi khi mở khóa lịch");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-600 animate-pulse uppercase tracking-widest text-xl"><Loader2 className="animate-spin mr-2 inline" /> Đang tải dữ liệu...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans bg-gray-50 min-h-screen pt-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Khu vực đối tác</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-3">
          <CalendarIcon size={36} className="text-blue-600" /> Lịch trình xe của tôi
        </h1>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-3">Quản lý lịch rảnh/bận cho các xe của bạn. Khóa lịch khi gia đình cần sử dụng.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: FORM KHÓA LỊCH */}
        <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 h-fit sticky top-8">
          <h2 className="text-lg font-black text-gray-800 uppercase italic mb-6 border-b-2 border-gray-50 pb-4">Thiết lập ngày bận</h2>
          
          <form onSubmit={handleBlockDate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Car size={14} /> Chọn xe của bạn</label>
              <select required value={formData.carId} onChange={(e) => setFormData({...formData, carId: e.target.value})} className="w-full bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 appearance-none">
                <option value="" disabled>-- Chọn xe --</option>
                {myCars.map(car => (
                  <option key={car.id} value={car.id}>{car.name} ({car.licensePlate || "Chưa có biển"})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Từ ngày</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-xl px-3 py-3 text-xs font-bold text-gray-700"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đến ngày</label>
                <input type="date" required min={formData.startDate || new Date().toISOString().split('T')[0]} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-xl px-3 py-3 text-xs font-bold text-gray-700"/>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14} /> Lý do khóa</label>
              <select value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 appearance-none">
                <option value="Chủ xe sử dụng">Tôi / Gia đình sử dụng</option>
                <option value="Bảo dưỡng định kỳ">Đi bảo dưỡng / Rửa xe</option>
                <option value="Đang sửa chữa">Đang sửa chữa</option>
                <option value="Đã cho người quen thuê">Đã cho người quen thuê ngoài</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting || myCars.length === 0} className="w-full bg-blue-600 text-white font-black uppercase italic tracking-widest py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex justify-center items-center gap-2 mt-4 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <><Plus size={16} /> Khóa Lịch Xe Này</>}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: DANH SÁCH LỊCH BẬN */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b-2 border-gray-50 pb-4">
                <h2 className="text-lg font-black text-gray-800 uppercase italic">Danh sách ngày đã khóa</h2>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-lg">{blockedDates.length} lịch bận</span>
            </div>

            <div className="space-y-4">
                {blockedDates.length === 0 ? (
                    <div className="text-center py-16">
                        <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 font-bold">Các xe của bạn hiện đang hoàn toàn trống lịch.</p>
                        <p className="text-xs text-gray-400 mt-1">Sẵn sàng nhận đơn thuê từ khách hàng!</p>
                    </div>
                ) : (
                    blockedDates.map((block) => {
                        // Xử lý định dạng ngày tháng để hiển thị đẹp
                        const sd = new Date(block.startDate).toLocaleDateString('vi-VN');
                        const ed = new Date(block.endDate).toLocaleDateString('vi-VN');
                        
                        return (
                        <div key={block.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-blue-200 rounded-2xl transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                    <CalendarIcon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-blue-900 text-sm">{block.car?.name}</h4>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold bg-white border border-gray-200 px-2 py-0.5 rounded mt-1 inline-block">
                                        {block.car?.licensePlate || "Đang cập nhật"}
                                    </span>
                                    
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-xs font-bold text-gray-700 bg-gray-200/50 px-2 py-1 rounded-md">{sd}</p>
                                        <ArrowRight size={12} className="text-gray-400" />
                                        <p className="text-xs font-bold text-gray-700 bg-gray-200/50 px-2 py-1 rounded-md">{ed}</p>
                                    </div>
                                    <p className="text-[11px] text-orange-600 font-bold mt-2 flex items-center gap-1">
                                        <ShieldAlert size={12} /> {block.reason}
                                    </p>
                                </div>
                            </div>

                            <button onClick={() => handleUnblock(block.id)} className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-gray-200 shadow-sm font-bold text-sm flex items-center justify-center gap-2 opacity-100 lg:opacity-50 group-hover:opacity-100">
                                <Trash2 size={16} /> Mở khóa
                            </button>
                        </div>
                    )})
                )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}