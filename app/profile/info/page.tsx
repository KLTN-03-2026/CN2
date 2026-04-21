/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  ArrowLeft, User as UserIcon, Phone, 
  Save, Edit2, ShieldCheck, Mail, Lock
} from "lucide-react";

export default function ProfileInfoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?auth=login");
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchUserProfile(session.user.email);
    }
  }, [status, session, router]);

  const fetchUserProfile = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/profile?email=${email}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || session?.user?.name || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Lỗi tải thông tin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (passwordData.newPassword) {
      if (!passwordData.currentPassword) {
        return alert("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới!");
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return alert("Mật khẩu xác nhận không khớp!");
      }
      if (passwordData.newPassword.length < 6) {
        return alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      }
    }

    try {
      setSaving(true);
      
      const payload = {
        email: session?.user?.email,
        ...formData,
        ...(passwordData.newPassword ? {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        } : {})
      };

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const err = await res.json();
        alert(err.error || "Có lỗi xảy ra khi lưu thông tin.");
      }
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic text-blue-600 animate-pulse uppercase">
        Đang tải dữ liệu cá nhân...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-28 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <Link href="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-8 font-bold text-sm uppercase tracking-wider">
          <ArrowLeft size={16} /> Quay lại trang tổng quan
        </Link>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-blue-600"></div>
          
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-3">
                  <UserIcon className="text-blue-600" size={32} /> Hồ sơ cá nhân
                </h1>
                <p className="text-gray-400 mt-2 text-sm font-medium">Quản lý thông tin định danh và bảo mật của bạn.</p>
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl font-black uppercase italic text-xs transition-all border border-gray-200"
                >
                  <Edit2 size={14} /> Chỉnh sửa
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-5 py-3 rounded-2xl font-black uppercase italic text-xs transition-all"
                >
                  Hủy bỏ
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* CỘT 1: THÔNG TIN CÁ NHÂN */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <ShieldCheck size={18} className="text-blue-500" /> Thông tin cơ bản
                </h3>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Email (Không thể đổi)</label>
                  <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-2xl p-4 text-gray-500 font-medium">
                    <Mail size={18} className="text-gray-400" />
                    {session?.user?.email}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Họ và tên</label>
                  <div className={`flex items-center gap-3 border rounded-2xl p-4 transition-all ${isEditing ? 'bg-white border-blue-200 shadow-sm focus-within:border-blue-500' : 'bg-gray-50 border-gray-100'}`}>
                    <UserIcon size={18} className={isEditing ? "text-blue-500" : "text-gray-400"} />
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing}
                      className="w-full bg-transparent outline-none font-bold text-gray-700 disabled:text-gray-500" placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Số điện thoại</label>
                  <div className={`flex items-center gap-3 border rounded-2xl p-4 transition-all ${isEditing ? 'bg-white border-blue-200 shadow-sm focus-within:border-blue-500' : 'bg-gray-50 border-gray-100'}`}>
                    <Phone size={18} className={isEditing ? "text-blue-500" : "text-gray-400"} />
                    <input 
                      type="text" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing}
                      className="w-full bg-transparent outline-none font-bold text-gray-700 disabled:text-gray-500" placeholder="0901234567"
                    />
                  </div>
                </div>
              </div>

              {/* CỘT 2: BẢO MẬT */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Lock size={18} className="text-red-500" /> Bảo mật tài khoản
                </h3>
                
                <div className={`${!isEditing && 'opacity-50 pointer-events-none'}`}>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Mật khẩu hiện tại</label>
                  <div className={`flex items-center gap-3 border rounded-2xl p-4 transition-all ${isEditing ? 'bg-white border-red-100 focus-within:border-red-400' : 'bg-gray-50 border-gray-100'}`}>
                    <Lock size={18} className={isEditing ? "text-red-300" : "text-gray-400"} />
                    <input 
                      type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} disabled={!isEditing}
                      className="w-full bg-transparent outline-none font-bold text-gray-700" placeholder={isEditing ? "Nhập mật khẩu cũ" : "••••••••"}
                    />
                  </div>
                </div>

                <div className={`${!isEditing && 'opacity-50 pointer-events-none'}`}>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Mật khẩu mới</label>
                  <div className={`flex items-center gap-3 border rounded-2xl p-4 transition-all ${isEditing ? 'bg-white border-red-100 focus-within:border-red-400' : 'bg-gray-50 border-gray-100'}`}>
                    <Lock size={18} className={isEditing ? "text-red-400" : "text-gray-400"} />
                    <input 
                      type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} disabled={!isEditing}
                      className="w-full bg-transparent outline-none font-bold text-gray-700" placeholder={isEditing ? "Mật khẩu mới" : "••••••••"}
                    />
                  </div>
                </div>

                <div className={`${!isEditing && 'opacity-50 pointer-events-none'}`}>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Xác nhận mật khẩu</label>
                  <div className={`flex items-center gap-3 border rounded-2xl p-4 transition-all ${isEditing ? 'bg-white border-red-100 focus-within:border-red-400' : 'bg-gray-50 border-gray-100'}`}>
                    <Lock size={18} className={isEditing ? "text-red-500" : "text-gray-400"} />
                    <input 
                      type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} disabled={!isEditing}
                      className="w-full bg-transparent outline-none font-bold text-gray-700" placeholder={isEditing ? "Nhập lại mật khẩu mới" : "••••••••"}
                    />
                  </div>
                </div>

                {!isEditing && (
                  <p className="text-[10px] font-medium text-gray-400 italic text-center mt-4">
                    * Nhấn "Chỉnh sửa" ở góc trên để đổi mật khẩu.
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-10 flex justify-end pt-6 border-t border-gray-100">
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-wider hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : <><Save size={18} /> Lưu thay đổi</>}
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}