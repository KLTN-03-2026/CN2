/* eslint-disable */
// @ts-nocheck
"use client";

import { useState } from "react";
import { Star, X, Loader2, Send } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  carId: number;
  carName: string;
  onSuccess: () => void; // Hàm gọi lại khi đánh giá thành công để reload trang
}

export default function ReviewModal({ isOpen, onClose, bookingId, carId, carName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, carId, rating, comment }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert("🎉 Cảm ơn bạn đã đánh giá chuyến đi!");
        onSuccess(); // Reload lại dữ liệu
        onClose();   // Đóng popup
      } else {
        alert(`❌ Lỗi: ${data.error}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi kết nối!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-20"><Star size={100} fill="currentColor" /></div>
          <div className="relative z-10">
            <h3 className="font-black uppercase italic tracking-tighter text-xl">Đánh giá trải nghiệm</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-1">Chuyến đi: {carName}</p>
          </div>
          <button onClick={onClose} className="relative z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-8 flex flex-col items-center">
          <p className="text-sm font-bold text-gray-500 mb-4 text-center">Bạn cảm thấy hài lòng với chiếc xe này chứ?</p>
          
          {/* Chọn Sao */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  size={40} 
                  className={`transition-colors duration-200 ${
                    star <= (hoveredRating || rating) 
                      ? "text-yellow-400 fill-yellow-400 drop-shadow-md" 
                      : "text-gray-200 fill-gray-100"
                  }`} 
                />
              </button>
            ))}
          </div>

          <div className="text-[11px] font-black uppercase text-yellow-500 italic mb-6 bg-yellow-50 px-4 py-1.5 rounded-full">
            {rating === 5 ? "Tuyệt vời!" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Tạm được" : "Rất tệ"}
          </div>

          {/* Ô nhập Review */}
          <div className="w-full">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Chia sẻ thêm (Không bắt buộc)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Xe đi êm, chủ xe nhiệt tình..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none h-24 custom-scrollbar"
            ></textarea>
          </div>

          {/* Nút Submit */}
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Gửi đánh giá</>}
          </button>
        </div>

      </div>
    </div>
  );
}