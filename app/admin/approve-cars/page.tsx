/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldAlert, Car, Banknote, Loader2 } from "lucide-react";
import CarApprovals from "./components/CarApprovals";
import WithdrawalApprovals from "./components/WithdrawalApprovals";

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); 
  const [activeTab, setActiveTab] = useState("CARS"); 

  useEffect(() => {
    if (status === "loading") return; 
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      router.push("/"); 
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold uppercase tracking-widest text-sm">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* HEADER VÀ TAB CHUYỂN ĐỔI */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1 shadow-md w-fit">
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

        {/* NỘI DUNG TÁCH BIỆT DỰA VÀO COMPONENT */}
        {activeTab === "CARS" ? <CarApprovals /> : <WithdrawalApprovals />}
        
      </div>
    </main>
  );
}