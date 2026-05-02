/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState, useMemo } from "react";
// BỔ SUNG ĐẦY ĐỦ CÁC ICON CẦN THIẾT
import { 
  Gift, Plus, Calendar, Tag, ChevronLeft, Loader2, 
  X, Percent, Banknote, Edit3, Trash2, ArrowRight, Clock, CheckCircle2, AlertCircle 
} from "lucide-react";
import Link from "next/link";

export default function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", code: "", discount: "", type: "PERCENT", description: "", startDate: "", expiryDate: ""
  });

  useEffect(() => { fetchPromos(); }, []);

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/promotions");
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải mã:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 📊 LOGIC TÍNH TOÁN THỐNG KÊ (MINI DASHBOARD)
  const stats = useMemo(() => {
    const totalUsage = promos.reduce((acc, curr) => acc + (curr.usageCount || 0), 0);
    const mostPopular = [...promos].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))[0]?.code || "N/A";
    const activePromos = promos.filter(p => {
        const now = new Date();
        return now >= new Date(p.startDate) && now <= new Date(p.expiryDate);
    }).length;

    return { totalUsage, mostPopular, activePromos };
  }, [promos]);

  // 🕒 XÁC ĐỊNH TRẠNG THÁI HIỆU LỰC
  const getStatus = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const expiryDate = new Date(end);

    if (now < startDate) return { label: "CHUẨN BỊ", color: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={10}/> };
    if (now > expiryDate) return { label: "HẾT HẠN", color: "bg-red-50 text-red-600 border-red-100", icon: <AlertCircle size={10}/> };
    return { label: "HOẠT ĐỘNG", color: "bg-green-50 text-green-700 border-green-100", icon: <CheckCircle2 size={10}/> };
  };

  const openEdit = (promo) => {
    setEditingId(promo.id);
    setFormData({
      title: promo.title,
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      description: promo.description,
      // Định dạng ngày về YYYY-MM-DD để hiển thị đúng trong input date
      startDate: new Date(promo.startDate).toISOString().split('T')[0],
      expiryDate: new Date(promo.expiryDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/promotions/${editingId}` : "/api/admin/promotions";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          discount: Number(formData.discount),
          startDate: new Date(formData.startDate).toISOString(),
          expiryDate: new Date(formData.expiryDate).toISOString()
        })
      });

      if (res.ok) {
        setShowModal(false);
        fetchPromos();
        alert("HỆ THỐNG: ĐÃ LƯU THAY ĐỔI THÀNH CÔNG!");
      } else {
        alert("LỖI: VUI LÒNG KIỂM TRA LẠI DỮ LIỆU!");
      }
    } catch (e) {
      alert("LỖI KẾT NỐI!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("XÁC NHẬN: BẠN CÓ CHẮC MUỐN XÓA VOUCHER NÀY?")) return;
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
      if (res.ok) fetchPromos();
    } catch (e) {
      alert("LỖI KHI XÓA!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <Link href="/admin" className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 mb-2 hover:text-blue-600 transition-all group">
              <span className="flex items-center gap-1 italic">
                <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform"/> QUAY LẠI QUẢN TRỊ ĐƠN
              </span>
            </Link>
            <h1 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-3 leading-none">
              <Gift size={36} className="text-blue-600" /> CHIẾN DỊCH ƯU ĐÃI
            </h1>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData({title:"",code:"",discount:"",type:"PERCENT",description:"",startDate:"",expiryDate:""}); setShowModal(true); }}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs shadow-xl shadow-blue-100 hover:bg-black transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={18}/> TẠO MÃ MỚI
          </button>
        </div>

        {/* MINI DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 transform hover:scale-[1.02] transition-all">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Tag size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 italic">Đang hoạt động</p>
              <h4 className="text-2xl font-black text-blue-900 italic tracking-tighter uppercase">{stats.activePromos} Chiến dịch</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 transform hover:scale-[1.02] transition-all">
            <div className="bg-green-50 p-4 rounded-2xl text-green-600"><CheckCircle2 size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 italic">Tổng lượt sử dụng</p>
              <h4 className="text-2xl font-black text-blue-900 italic tracking-tighter uppercase">{stats.totalUsage} Lần áp dụng</h4>
            </div>
          </div>
          <div className="bg-blue-900 p-6 rounded-[32px] shadow-xl text-white flex items-center gap-5 transform hover:scale-[1.02] transition-all">
            <div className="bg-blue-600/30 p-4 rounded-2xl text-white"><Percent size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1 italic">Mã được dùng nhiều nhất</p>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter">{stats.mostPopular}</h4>
            </div>
          </div>
        </div>

        {/* BẢNG QUẢN LÝ */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="p-6 border-b border-gray-100">CHƯƠNG TRÌNH</th>
                <th className="p-6 border-b border-gray-100">MÃ CODE</th>
                <th className="p-6 border-b border-gray-100">GIÁ TRỊ</th>
                <th className="p-6 border-b border-gray-100 text-center">SỐ LƯỢT DÙNG</th>
                <th className="p-6 border-b border-gray-100">HIỆU LỰC</th>
                <th className="p-6 border-b border-gray-100 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
              ) : promos.map((p) => {
                const status = getStatus(p.startDate, p.expiryDate);
                return (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="p-6">
                      <p className="font-black text-blue-900 uppercase italic text-sm mb-1 leading-none">{p.title}</p>
                      <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase italic">
                        {new Date(p.startDate).toLocaleDateString('vi-VN')} <ArrowRight size={10} className="text-blue-600"/> {new Date(p.expiryDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="bg-white px-3 py-1.5 rounded-lg font-black text-blue-600 border-2 border-dashed border-gray-200 text-[10px] tracking-widest uppercase">
                        {p.code}
                      </span>
                    </td>
                    <td className="p-6 font-black text-lg italic text-blue-900 tracking-tighter">
                       <span className="flex items-center gap-1">
                          {p.type === "PERCENT" ? <Percent size={14} className="text-green-600"/> : <Banknote size={14} className="text-blue-600"/>}
                          {p.type === "PERCENT" ? `${p.discount}%` : `${p.discount.toLocaleString()}đ`}
                       </span>
                    </td>
                    
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className="text-sm font-black text-blue-900 italic tracking-tighter">{p.usageCount || 0}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase italic">lượt</span>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-black uppercase italic ${status.color}`}>
                        {status.icon} {status.label}
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95">
                          <Edit3 size={16}/>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {promos.length === 0 && !isLoading && (
            <div className="p-20 text-center">
              <Gift size={48} className="mx-auto text-gray-100 mb-4" />
              <p className="text-gray-300 font-black uppercase italic text-xs tracking-widest">Chưa có chiến dịch nào được tạo</p>
            </div>
          )}
        </div>

        {/* MODAL THÊM/SỬA */}
        {showModal && (
          <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <form onSubmit={handleSave} className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300 relative border border-white/20">
              <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mb-8 text-center leading-none">
                {editingId ? "CẬP NHẬT CHIẾN DỊCH" : "TẠO CHIẾN DỊCH MỚI"}
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 ml-2 uppercase italic tracking-widest">Tên ưu đãi</label>
                  <input required placeholder="VD: CHÀO HÈ 2026" value={formData.title} className="w-full p-4 bg-gray-50 rounded-2xl font-bold uppercase italic outline-none border-2 border-transparent focus:border-blue-600 transition-all" onChange={e => setFormData({...formData, title: e.target.value.toUpperCase()})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 ml-2 uppercase italic tracking-widest">Mã Voucher</label>
                    <input required placeholder="VD: SUMMER26" value={formData.code} className="w-full p-4 bg-gray-50 rounded-2xl font-black uppercase italic outline-none border-2 border-transparent focus:border-blue-600 transition-all" onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 ml-2 uppercase italic tracking-widest">Giá trị giảm</label>
                    <input required type="number" placeholder="Số tiền/ %" value={formData.discount} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-600 transition-all" onChange={e => setFormData({...formData, discount: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 ml-2 uppercase italic tracking-widest">Bắt đầu từ</label>
                    <input required type="date" value={formData.startDate} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-600 transition-all" onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 ml-2 uppercase italic tracking-widest">Hết hạn vào</label>
                    <input required type="date" value={formData.expiryDate} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-600 transition-all" onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 ml-2 uppercase italic tracking-widest">Loại Voucher</label>
                  <select 
    value={formData.type} 
    className="w-full p-4 bg-gray-50 rounded-2xl font-black uppercase italic outline-none cursor-pointer border-2 border-transparent focus:border-blue-600 transition-all text-sm" 
    onChange={e => setFormData({...formData, type: e.target.value})}
  >
    <option value="NORMAL">MẶC ĐỊNH (Không yêu cầu điều kiện)</option>
    <option value="NEW_USER">TÂN BINH (Chỉ áp dụng chuyến đầu tiên)</option>
    <option value="WEEKEND">CUỐI TUẦN (Chỉ áp dụng nhận xe T7, CN)</option>
    <option value="LONG_TRIP">DÀI NGÀY (Thuê từ 3 ngày trở lên)</option>
    <option value="LOYALTY_5">KHÁCH QUEN (Chỉ áp dụng chuyến thứ 5)</option>
    <option value="EARLY_BIRD">ĐẶT SỚM (Yêu cầu đặt trước 7 ngày)</option>
  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 ml-2 uppercase italic tracking-widest">Mô tả chương trình</label>
                  <textarea placeholder="MÔ TẢ NGẮN GỌN..." value={formData.description} className="w-full p-4 bg-gray-50 rounded-2xl font-bold h-24 resize-none outline-none border-2 border-transparent focus:border-blue-600 transition-all" onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black uppercase italic text-gray-400 text-[10px] tracking-widest hover:text-blue-900 transition-colors">HỦY BỎ</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase italic shadow-lg shadow-blue-100 text-[10px] tracking-widest hover:bg-black transition-all">XÁC NHẬN LƯU</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}