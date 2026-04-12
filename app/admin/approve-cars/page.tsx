/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  CheckCircle, XCircle, CarFront, User as UserIcon, Phone, MapPin, 
  Banknote, Calendar, ShieldAlert, FileText, Settings, Search, 
  Loader2, Wallet, Clock, AlertCircle, Building2, Car,
  Eye, Image as ImageIcon, X, CheckCircle2
} from "lucide-react";

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(Math.abs(amount)) + "đ";
};

// 🚀 HÀM ĐỌC ẢNH ĐÃ ĐƯỢC CHỈNH SỬA ĐỂ ĐỌC ĐÚNG CỘT "image" VÀ "gallery"
const getCarImages = (car) => {
  if (!car) return [];
  let allImages = [];

  // 1. Lấy ảnh chính (từ cột image)
  if (car.image && typeof car.image === 'string') {
    allImages.push(car.image);
  }

  // 2. Lấy các ảnh phụ (từ cột gallery)
  if (car.gallery) {
    if (Array.isArray(car.gallery)) {
      allImages = [...allImages, ...car.gallery];
    } else if (typeof car.gallery === 'string') {
      try {
        const parsed = JSON.parse(car.gallery);
        if (Array.isArray(parsed)) {
          allImages = [...allImages, ...parsed];
        }
      } catch (e) {
        if (car.gallery.includes(',')) {
          allImages = [...allImages, ...car.gallery.split(',').map(i => i.trim())];
        } else {
          allImages.push(car.gallery);
        }
      }
    }
  }

  // Lọc bỏ các giá trị rỗng/lỗi
  return allImages.filter(Boolean);
};

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); 

  const [activeTab, setActiveTab] = useState("CARS"); 
  const [pendingCars, setPendingCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedCar, setSelectedCar] = useState(null); 
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  const [rejectReason, setRejectReason] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);

  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState("PENDING");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; 
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      router.push("/"); 
      return;
    }

    if (activeTab === "CARS") {
      fetchPendingCars();
    } else {
      fetchWithdrawals();
    }
  }, [status, session, router, activeTab]);

  const fetchPendingCars = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/cars/pending');
      const data = await response.json();
      if (data.success || data.cars) {
        setPendingCars(data.cars || data);
      } else if (Array.isArray(data)) {
        setPendingCars(data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu xe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/withdrawals");
      const data = await res.json();
      setWithdrawals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu rút tiền:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCarModal = (car) => {
    setSelectedCar(car);
    setCurrentImageIdx(0); 
    setRejectReason("");
  };

  const handleApproveCar = async (carId, ownerName) => {
    if (!window.confirm(`Xác nhận: Duyệt chiếc xe của ${ownerName || 'đối tác'} lên hệ thống?`)) return;
    setIsProcessing(true);
    try {
        const response = await fetch(`/api/admin/cars/${carId}/approve`, { method: "POST" });
        const data = await response.json();
        if (response.ok) {
            setPendingCars(prev => prev.filter(car => car.id !== carId));
            alert(`✅ Đã duyệt thành công xe của ${ownerName || 'đối tác'}!`);
            setSelectedCar(null); 
        } else {
            alert(`Lỗi: ${data.error}`);
        }
    } catch (error) { alert("Lỗi kết nối máy chủ!"); }
    finally { setIsProcessing(false); }
  };

  const handleRejectCar = async (carId, ownerName) => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối để đối tác biết đường chỉnh sửa!");
      return;
    }
    if (!window.confirm(`Xác nhận: Từ chối hồ sơ xe của ${ownerName || 'đối tác'}?`)) return;
    
    setIsProcessing(true);
    try {
        const response = await fetch(`/api/admin/cars/${carId}/reject`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: rejectReason })
        });
        if (response.ok) {
            setPendingCars(prev => prev.filter(car => car.id !== carId));
            alert(`❌ Đã từ chối hồ sơ. Lý do: ${rejectReason}`);
            setSelectedCar(null); 
            setRejectReason("");  
        }
    } catch (error) { alert("Lỗi kết nối máy chủ!"); }
    finally { setIsProcessing(false); }
  };

  const handleWithdrawalAction = async (id, newStatus) => {
    const actionText = newStatus === 'COMPLETED' ? 'ĐÃ CHUYỂN KHOẢN và DUYỆT' : 'TỪ CHỐI và HOÀN TIỀN';
    if (!confirm(`XÁC NHẬN: Bạn ${actionText} yêu cầu rút tiền này?`)) return;
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Thao tác thành công!");
        fetchWithdrawals();
      } else {
        alert(`❌ LỖI: ${data.error}`);
      }
    } catch (error) { alert("Đã xảy ra lỗi kết nối!"); }
  };

  const filteredCars = pendingCars.filter(car => {
    const searchString = searchTerm.toLowerCase();
    const ownerName = car.user?.name?.toLowerCase() || "";
    const carName = car.name?.toLowerCase() || "";
    const plate = car.licensePlate?.toLowerCase() || "";
    return ownerName.includes(searchString) || carName.includes(searchString) || plate.includes(searchString);
  });

  const filteredWithdrawals = withdrawalFilter === "ALL" ? withdrawals : withdrawals.filter(w => w.status === withdrawalFilter);

  if (status === "loading" || (status === "authenticated" && isLoading && pendingCars.length === 0 && withdrawals.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold uppercase tracking-widest text-sm">Đang tải trung tâm xét duyệt...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1 shadow-md">
                  <ShieldAlert size={12} /> Trung tâm điều hành
                </span>
            </div>
            <h1 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter">
              Xét duyệt hệ thống
            </h1>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab("CARS")}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all flex items-center justify-center gap-2 ${
                activeTab === "CARS" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Car size={16} /> Duyệt Xe Mới
            </button>
            <button 
              onClick={() => setActiveTab("WITHDRAWALS")}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all flex items-center justify-center gap-2 ${
                activeTab === "WITHDRAWALS" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Banknote size={16} /> Duyệt Rút Tiền
            </button>
          </div>
        </div>

        {isLoading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-400" size={32} /></div>
        ) : (
          <>
            {activeTab === "CARS" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500 font-bold text-sm px-4">
                    Đang có <span className="text-red-500 font-black text-lg">{pendingCars.length}</span> hồ sơ chờ duyệt
                  </p>
                  <div className="relative w-full md:w-80">
                    <input 
                      type="text" 
                      placeholder="Tìm tên chủ xe, xe, biển số..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 font-bold text-sm text-gray-700"
                    />
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  </div>
                </div>

                {filteredCars.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[30px] border-2 border-dashed border-gray-200 shadow-sm">
                    <ShieldAlert className="mx-auto text-green-400 mb-4" size={48} />
                    <h3 className="text-xl font-black text-gray-800 uppercase italic">Tuyệt vời!</h3>
                    <p className="text-gray-500 font-bold">Hiện không có hồ sơ xe nào chờ duyệt hoặc không tìm thấy kết quả.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCars.map((car) => {
                      const carImages = getCarImages(car); 
                      
                      return (
                        <div key={car.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:border-blue-200 transition-all">
                          <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {carImages.length > 0 ? (
                              <img src={carImages[0]} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                <ImageIcon size={48} />
                              </div>
                            )}
                            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase px-3 py-1.5 rounded-lg italic shadow-md">
                              Chờ duyệt
                            </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                              <h3 className="text-lg font-black text-blue-900 uppercase italic tracking-tighter truncate">{car.name}</h3>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                                <MapPin size={12}/> {car.location || "Chưa cập nhật"}
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3 flex-1 border border-gray-100">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-bold flex items-center gap-2"><UserIcon size={14}/> Chủ xe:</span>
                                <span className="font-black text-gray-800 truncate max-w-[120px]">{car.user?.name || car.ownerName || "N/A"}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-bold flex items-center gap-2"><Settings size={14}/> Biển số:</span>
                                <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{car.licensePlate || "N/A"}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-bold flex items-center gap-2"><Banknote size={14}/> Đề xuất:</span>
                                <span className="font-black text-emerald-600">{formatCurrency(car.priceOriginal)}/ngày</span>
                              </div>
                            </div>

                            <button 
                              onClick={() => openCarModal(car)}
                              className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic active:scale-95 shadow-sm"
                            >
                              <Eye size={16} /> Xem chi tiết & Xử lý
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MODAL HIỂN THỊ CHI TIẾT */}
                {selectedCar && (() => {
                  const selectedImages = getCarImages(selectedCar); 
                  const mainImageUrl = selectedImages[currentImageIdx] || null;
                  
                  return (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm" onClick={() => setSelectedCar(null)}></div>
                      
                      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                          <div>
                            <h2 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-3">
                              <FileText className="text-blue-600" /> Chi tiết hồ sơ phương tiện
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Mã hệ thống: #{selectedCar.id}</p>
                          </div>
                          <button onClick={() => setSelectedCar(null)} className="p-2 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors">
                            <X size={24} />
                          </button>
                        </div>

                        <div className="p-8 overflow-y-auto bg-gray-50/50 flex-1 custom-scrollbar">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              
                              {/* KHU VỰC ẢNH TƯƠNG TÁC */}
                              <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-4 ml-2 pr-2">
                                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Hình ảnh thực tế
                                  </h3>
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                    {selectedImages.length} ảnh đính kèm
                                  </span>
                                </div>
                                
                                <div className="aspect-video rounded-[24px] overflow-hidden bg-gray-100 border border-gray-100">
                                  {mainImageUrl ? (
                                    <img src={mainImageUrl} alt="Car Main" className="w-full h-full object-cover transition-opacity duration-300" />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                      <ImageIcon size={48} className="mb-2"/>
                                      <span className="text-xs font-bold">Chưa tải ảnh lên</span>
                                    </div>
                                  )}
                                </div>
                                
                                {selectedImages.length > 1 && (
                                  <div className="grid grid-cols-5 gap-2 mt-3">
                                    {selectedImages.map((img, idx) => (
                                      <div 
                                        key={idx} 
                                        onClick={() => setCurrentImageIdx(idx)}
                                        className={`aspect-video rounded-xl overflow-hidden bg-gray-100 cursor-pointer border-2 transition-all ${currentImageIdx === idx ? 'border-blue-600 opacity-100 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                      >
                                        <img src={img} className="w-full h-full object-cover" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Mô tả từ chủ xe</h3>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl italic border border-gray-100 min-h-[100px] whitespace-pre-line">
                                  {selectedCar.description || "Không có mô tả chi tiết."}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><UserIcon size={14}/> Thông tin đối tác định danh</h3>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-500">Họ và tên:</span>
                                    <span className="text-sm font-black text-blue-900 uppercase">{selectedCar.user?.name || selectedCar.ownerName || "Chưa cập nhật"}</span>
                                  </div>
                                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-500">Số điện thoại:</span>
                                    <span className="text-sm font-black text-gray-800 flex items-center gap-1"><Phone size={14} className="text-green-500"/> {selectedCar.user?.phone || selectedCar.ownerPhone || "Chưa cập nhật"}</span>
                                  </div>
                                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-500">CCCD/CMND:</span>
                                    <span className="text-sm font-black text-gray-800">{selectedCar.ownerCCCD || "Đang cập nhật"}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500">Email:</span>
                                    <span className="text-sm font-bold text-gray-600">{selectedCar.user?.email || "N/A"}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Settings size={14}/> Thông số phương tiện</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                  <div>
                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dòng xe</span>
                                    <span className="text-sm font-black text-gray-800">{selectedCar.name}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hãng & Đời xe</span>
                                    <span className="text-sm font-black text-gray-800">{selectedCar.brand} {selectedCar.model ? `- ${selectedCar.model}` : ''}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Biển kiểm soát</span>
                                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{selectedCar.licensePlate}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Kiểu xe</span>
                                    <span className="text-sm font-black text-gray-800">{selectedCar.category || "N/A"}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hộp số / Nhiên liệu</span>
                                    <span className="text-xs font-bold text-gray-600">{selectedCar.transmission || "N/A"} • {selectedCar.fuel || "N/A"}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Số chỗ ngồi</span>
                                    <span className="text-xs font-bold text-gray-600 bg-orange-50 text-orange-600 px-2 py-1 rounded">{selectedCar.seats || "N/A"} Chỗ</span>
                                  </div>
                                  <div className="col-span-2 mt-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><Banknote size={14}/> Mức giá đề xuất:</span>
                                    <span className="text-xl font-black text-emerald-700 italic">{formatCurrency(selectedCar.priceOriginal)} / ngày</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-red-50/50 p-5 rounded-[24px] border border-red-100">
                                <label className="block text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                  <AlertCircle size={14}/> Lý do nếu từ chối (bắt buộc khi Hủy):
                                </label>
                                <textarea 
                                  placeholder="Ví dụ: Hình ảnh xe quá mờ, biển số không khớp, thông tin sai lệch..."
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  className="w-full bg-white border border-red-200 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-200 transition-shadow"
                                  rows={2}
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-4 shrink-0">
                          <button 
                            disabled={isProcessing}
                            onClick={() => handleRejectCar(selectedCar.id, selectedCar.user?.name)}
                            className="px-6 py-3 bg-white text-red-500 border-2 border-red-100 hover:bg-red-50 hover:border-red-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic disabled:opacity-50"
                          >
                            {isProcessing ? "Đang xử lý..." : "Từ chối hồ sơ"}
                          </button>
                          <button 
                            disabled={isProcessing}
                            onClick={() => handleApproveCar(selectedCar.id, selectedCar.user?.name)}
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 italic disabled:opacity-50 active:scale-95"
                          >
                            <CheckCircle2 size={16} /> Phê duyệt lên sàn
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB RÚT TIỀN (Giữ nguyên) */}
            {activeTab === "WITHDRAWALS" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                   <p className="text-gray-500 font-bold text-sm px-4">Kế toán trả tiền Đối tác</p>
                  <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    {["PENDING", "COMPLETED", "FAILED", "ALL"].map((s) => (
                      <button 
                        key={s} onClick={() => setWithdrawalFilter(s)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase italic transition-all ${withdrawalFilter === s ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-gray-400 hover:bg-white hover:shadow-sm"}`}
                      >
                        {s === "ALL" ? "Tất cả" : s === "PENDING" ? "Chờ xử lý" : s === "COMPLETED" ? "Đã duyệt" : "Đã hủy"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                          <th className="p-6 border-b border-gray-100">Đối tác</th>
                          <th className="p-6 border-b border-gray-100">Số tiền & Ngân hàng</th>
                          <th className="p-6 border-b border-gray-100">Thời gian</th>
                          <th className="p-6 border-b border-gray-100 text-center">Trạng thái & Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredWithdrawals.length === 0 ? (
                          <tr><td colSpan={4} className="p-16 text-center text-gray-400 font-bold italic">Chưa có yêu cầu rút tiền nào trong mục này.</td></tr>
                        ) : filteredWithdrawals.map((tx) => (
                          <tr key={tx.id} className="hover:bg-emerald-50/20 transition-colors group">
                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                  <Wallet size={20} />
                                </div>
                                <div>
                                  <p className="font-black text-emerald-900 uppercase text-xs italic tracking-tighter">
                                    {tx.wallet?.ownerName || tx.wallet?.user?.name || "Đối tác ẩn danh"}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                                    <Phone size={10}/> {tx.wallet?.ownerPhone || tx.wallet?.user?.phone || "Chưa cập nhật"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6">
                              <p className="font-black text-red-600 text-lg italic tracking-tighter">
                                {formatCurrency(tx.amount)}
                              </p>
                              <div className="mt-2 bg-gray-50 border border-gray-100 p-3 rounded-xl w-fit">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                  <Building2 size={12} /> {tx.wallet?.bankName || "Chưa cập nhật Ngân hàng"}
                                </p>
                                <p className="text-sm font-black text-gray-800 tracking-wider mb-0.5">
                                  {tx.wallet?.bankAccount || "Chưa có STK"}
                                </p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">
                                  {tx.wallet?.bankOwnerName || "Chưa có tên chủ thẻ"}
                                </p>
                              </div>
                            </td>
                            <td className="p-6">
                              <p className="text-xs font-bold text-gray-600">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</p>
                              <p className="text-[10px] text-gray-400 font-bold mt-1">{new Date(tx.createdAt).toLocaleTimeString('vi-VN')}</p>
                            </td>
                            <td className="p-6 text-center">
                              {tx.status === 'PENDING' ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase italic bg-yellow-50 text-yellow-600 flex items-center gap-1">
                                    <Clock size={12}/> Chờ xử lý
                                  </span>
                                  <div className="flex gap-2 mt-1">
                                    <button onClick={() => handleWithdrawalAction(tx.id, 'COMPLETED')} className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 shadow-lg transition-all active:scale-95" title="Duyệt - Đã chuyển tiền">
                                      <CheckCircle size={18} />
                                    </button>
                                    <button onClick={() => handleWithdrawalAction(tx.id, 'FAILED')} className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95" title="Từ chối - Hoàn tiền">
                                      <XCircle size={18} />
                                    </button>
                                  </div>
                                </div>
                              ) : tx.status === 'COMPLETED' ? (
                                <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase italic bg-emerald-50 text-emerald-600 inline-flex items-center gap-1 border border-emerald-100">
                                   <CheckCircle size={12}/> Đã hoàn thành
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase italic bg-red-50 text-red-600 inline-flex items-center gap-1 border border-red-100">
                                   <AlertCircle size={12}/> Bị từ chối
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}