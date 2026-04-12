/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { Gift, Tag, Copy, Loader2 } from "lucide-react";

export default function PromotionsPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/promotions")
      .then(res => res.json())
      .then(data => {
        setPromos(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}. Hãy sử dụng khi thanh toán!`);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-blue-900 uppercase italic tracking-tighter mb-4">
            Đặc quyền <span className="text-blue-600">BonbonCar</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Mã giảm giá dành riêng cho thành viên</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promos.map((promo) => (
              <div key={promo.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex items-center gap-8 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white flex-shrink-0 z-10 shadow-lg shadow-blue-200">
                  <Gift size={40} />
                </div>
                <div className="flex-grow z-10">
                  <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
                    Giảm {promo.discount}{promo.type === "PERCENT" ? "%" : "đ"}
                  </span>
                  <h3 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mt-2">{promo.title}</h3>
                  <p className="text-gray-400 text-xs font-medium mb-6">{promo.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 px-4 py-3 rounded-2xl flex items-center gap-3">
                      <Tag size={16} className="text-blue-600" />
                      <span className="font-black text-blue-900 uppercase italic tracking-widest">{promo.code}</span>
                    </div>
                    <button onClick={() => copyToClipboard(promo.code)} className="p-4 bg-blue-900 text-white rounded-2xl hover:bg-black transition-all active:scale-90">
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}