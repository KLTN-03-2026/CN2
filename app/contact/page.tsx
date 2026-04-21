/* eslint-disable */
// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PhoneCall, Mail, MapPin, Clock, Send, 
  MessageSquare, ChevronRight, CheckCircle2 
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setIsSuccess(false), 4000); // Ẩn thông báo sau 4s
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-28 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl mb-6 transform -rotate-3 shadow-sm border border-blue-50">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-blue-900 uppercase italic tracking-tighter mb-4">
            Liên hệ hỗ trợ
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Đội ngũ chăm sóc khách hàng của ViVuCar luôn sẵn sàng lắng nghe và giải quyết mọi thắc mắc của bạn trên mọi nẻo đường.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-500"></div>
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ TRỰC TIẾP */}
          <div className="w-full lg:w-5/12 bg-blue-900 p-10 md:p-12 text-white relative overflow-hidden">
            {/* Hiệu ứng trang trí */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8">Thông tin liên hệ</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center text-blue-300 group-hover:bg-blue-700 transition-colors shrink-0">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Hotline CSKH (24/7)</p>
                    <p className="text-xl font-black italic tracking-tighter whitespace-nowrap">1900 8888</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center text-blue-300 group-hover:bg-blue-700 transition-colors shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Email hỗ trợ</p>
                    <p className="font-bold">support@vivucar.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center text-blue-300 group-hover:bg-blue-700 transition-colors shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Trụ sở chính</p>
                    <p className="text-sm font-medium leading-relaxed text-blue-100">
                      Tầng 15, Tòa nhà ViVuCar Tower,<br />
                      Số 123 Đường Nguyễn Văn Linh,<br />
                      Quận Hải Châu, TP. Đà Nẵng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center text-blue-300 group-hover:bg-blue-700 transition-colors shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Giờ làm việc</p>
                    <p className="text-sm font-medium leading-relaxed text-blue-100">
                      Thứ 2 - Thứ 6: 08:00 - 18:00<br />
                      Thứ 7 - CN: 08:00 - 12:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-blue-800">
                <p className="text-[10px] font-bold text-blue-300 italic">
                  * Trong các trường hợp khẩn cấp về an toàn xe, vui lòng gọi trực tiếp Hotline để được ưu tiên xử lý.
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
          <div className="w-full lg:w-7/12 p-10 md:p-12">
            <h2 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Gửi tin nhắn cho chúng tôi</h2>
            <p className="text-sm text-gray-500 mb-8 font-medium">Chúng tôi sẽ phản hồi bạn qua email hoặc số điện thoại trong vòng 2 giờ làm việc.</p>

            {isSuccess ? (
              <div className="bg-green-50 border border-green-100 rounded-[24px] p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-green-700 uppercase italic tracking-tighter mb-2">Đã gửi thành công!</h3>
                <p className="text-sm text-green-600 font-medium">Cảm ơn bạn đã liên hệ. Đội ngũ ViVuCar sẽ sớm kết nối lại với bạn.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Họ và tên <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required name="name" value={formData.name} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" 
                      placeholder="VD: Thái Đăng Khoa"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" required name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" 
                      placeholder="VD: 0901234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Email hỗ trợ</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" 
                    placeholder="VD: khoathai@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Nội dung cần hỗ trợ <span className="text-red-500">*</span></label>
                  <textarea 
                    required name="message" value={formData.message} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none h-32" 
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải (mã chuyến đi, lỗi thanh toán...)"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-black uppercase italic tracking-wider text-[11px] rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-70"
                >
                  {isSubmitting ? "Đang gửi..." : (
                    <>Gửi yêu cầu <Send size={14} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* CÂU HỎI THƯỜNG GẶP (Link nhanh) */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 font-medium mb-4">Bạn cần giải đáp nhanh? Hãy xem qua bộ câu hỏi phổ biến của chúng tôi.</p>
          <Link href="/faq" className="inline-flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors bg-blue-50 px-6 py-3 rounded-full border border-blue-100">
            Xem Câu hỏi thường gặp (FAQ) <ChevronRight size={14} />
          </Link>
        </div>

      </div>
    </main>
  );
}